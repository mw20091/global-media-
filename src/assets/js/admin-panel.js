document.addEventListener('DOMContentLoaded', () => {
  const ADMIN_PASSWORD = 'admin123';
  const STORAGE_KEY = 'ttmedia-admin-posts';
  const LOGIN_KEY = 'ttmedia-admin-auth';

  const SUPABASE_URL = 'https://klixbfwfxfcojiwuvhlw.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_Aj3nrOhNGvFzEz47fq8SDQ_JPHFJkX4';

  const loginBox = document.getElementById('adminLoginBox');
  const adminDashboard = document.getElementById('adminDashboard');
  const loginForm = document.getElementById('adminLoginForm');
  const logoutBtn = document.getElementById('logoutBtn');
  const articleForm = document.getElementById('articleForm');
  const articleList = document.getElementById('articleList');

  if (!loginForm || !articleForm || !articleList) {
    return;
  }

  const ENABLE_SUPABASE = typeof window !== 'undefined' && !!window.supabase;
  const supabase = ENABLE_SUPABASE ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;
  let pendingImageUrl = '';

  function showDashboard() {
    loginBox.classList.add('hidden');
    adminDashboard.classList.remove('hidden');
  }

  function showLogin() {
    adminDashboard.classList.add('hidden');
    loginBox.classList.remove('hidden');
  }

  function isLoggedIn() {
    return localStorage.getItem(LOGIN_KEY) === 'true';
  }

  function setLoggedIn(value) {
    localStorage.setItem(LOGIN_KEY, value ? 'true' : 'false');
  }

  function safeReadPosts() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];

    try {
      return JSON.parse(saved);
    } catch (error) {
      return [];
    }
  }

  function renderPosts(posts) {
    if (!posts.length) {
      articleList.innerHTML = '<p class="empty-state">No stories published yet.</p>';
      return;
    }

    articleList.innerHTML = posts
      .slice()
      .reverse()
      .map((post) => {
        const date = post.date || new Date(post.created_at || Date.now()).toISOString().slice(0, 10);
        return `
          <article class="mini-post">
            <div class="mini-post__head">
              <span>${post.category || 'General'}</span>
              <strong>${date}</strong>
            </div>
            <h3>${post.title}</h3>
            <p>${post.description || 'No summary provided.'}</p>
            <div class="mini-post__meta">
              <span>By ${post.author || 'TT Media Desk'}</span>
              <button type="button" class="delete-post" data-id="${post.id}">Delete</button>
            </div>
          </article>
        `;
      })
      .join('');

    document.querySelectorAll('.delete-post').forEach((button) => {
      button.addEventListener('click', async (event) => {
        const { id } = event.target.dataset;

        if (supabase) {
          const { error } = await supabase.from('posts').delete().eq('id', id);
          if (error) {
            alert('Could not delete the story from the database.');
            return;
          }
        } else {
          const postsAfterDelete = safeReadPosts().filter((post) => String(post.id) !== String(id));
          localStorage.setItem(STORAGE_KEY, JSON.stringify(postsAfterDelete));
        }

        await loadPosts();
      });
    });
  }

  async function loadPosts() {
    if (supabase) {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase load error:', error);
        renderPosts(safeReadPosts());
        return;
      }

      renderPosts(data || []);
      return;
    }

    renderPosts(safeReadPosts());
  }

  async function uploadImage(file) {
    if (!file) return '';

    if (supabase) {
      const bucketName = 'news-images';
      const fileName = `posts/${Date.now()}-${file.name.replace(/\s+/g, '-').toLowerCase()}`;
      const { data, error } = await supabase.storage.from(bucketName).upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

      if (!error && data) {
        const { data: publicData } = supabase.storage.from(bucketName).getPublicUrl(fileName);
        return publicData.publicUrl;
      }
    }

    return '';
  }

  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const input = document.getElementById('adminPassword');
    if (input.value === ADMIN_PASSWORD) {
      setLoggedIn(true);
      showDashboard();
      input.value = '';
    } else {
      alert('Incorrect password. Use the demo password shown on screen.');
    }
  });

  logoutBtn.addEventListener('click', () => {
    setLoggedIn(false);
    showLogin();
  });

  articleForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = document.getElementById('title').value.trim();
    const author = document.getElementById('author').value.trim();
    const category = document.getElementById('category').value;
    const description = document.getElementById('description').value.trim();
    const body = document.getElementById('body').value.trim();
    const publishDate = document.getElementById('publishDate').value || new Date().toISOString().slice(0, 10);

    if (!title || !body) {
      alert('Please add a title and article body.');
      return;
    }

    const imageFile = document.getElementById('imageUpload').files[0];
    const imageUrl = await uploadImage(imageFile);
    const post = {
      id: Date.now().toString(),
      title,
      author,
      category,
      description,
      body,
      date: publishDate,
      image: imageUrl || pendingImageUrl || '',
      created_at: new Date().toISOString()
    };

    if (supabase) {
      const { error } = await supabase.from('posts').insert([post]).select();
      if (error) {
        console.error('Supabase insert error:', error);
        alert('Database save failed. Check the Supabase table and RLS settings.');
        return;
      }
    } else {
      const posts = safeReadPosts();
      posts.push(post);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    }

    articleForm.reset();
    const preview = document.getElementById('imagePreview');
    preview.classList.add('hidden');
    preview.removeAttribute('src');
    document.getElementById('imageUpload').value = '';
    pendingImageUrl = '';
    await loadPosts();
    alert('Story saved successfully.');
  });

  const imageUpload = document.getElementById('imageUpload');
  imageUpload.addEventListener('change', (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (result) {
      const preview = document.getElementById('imagePreview');
      preview.src = result.target.result;
      pendingImageUrl = result.target.result;
      preview.classList.remove('hidden');
    };
    reader.readAsDataURL(file);
  });

  if (isLoggedIn()) {
    showDashboard();
  } else {
    showLogin();
  }

  loadPosts();
});
