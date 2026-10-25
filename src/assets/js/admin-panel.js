---
layout: layout.njk
title: Admin Panel
description: TT Media admin dashboard for creating and publishing articles and managing ad slots.
permalink: /admin-panel/
---

<section class="admin-shell">
  <div class="admin-login" id="adminLoginBox">
    <div class="admin-card">
      <h1>Admin Access</h1>
      <p>Enter the admin password to open the content dashboard.</p>
      <form id="adminLoginForm" class="admin-form">
        <input id="adminPassword" type="password" placeholder="Password" autocomplete="current-password" required />
        <button type="submit" class="button primary">Open dashboard</button>
      </form>
      <p class="admin-hint">Demo password: <strong>admin123</strong></p>
    </div>
  </div>

  <div class="admin-dashboard hidden" id="adminDashboard">
    <div class="admin-topbar">
      <div>
        <p class="eyebrow">Content dashboard</p>
        <h1>TT Media Admin</h1>
      </div>
      <button id="logoutBtn" class="button secondary" type="button">Logout</button>
    </div>

    <div class="admin-grid">
      <section class="admin-panel-card">
        <h2>Publish story</h2>
        <form id="articleForm" class="admin-form admin-form--stacked">
          <input type="text" id="title" placeholder="Article title" required />
          <input type="text" id="author" placeholder="Author" value="TT Media Desk" required />
          <select id="category">
            <option value="World">World</option>
            <option value="Politics">Politics</option>
            <option value="Business">Business</option>
            <option value="Technology">Technology</option>
            <option value="Sports">Sports</option>
            <option value="Culture">Culture</option>
            <option value="Opinion">Opinion</option>
          </select>
          <input type="date" id="publishDate" />
          <textarea id="description" rows="3" placeholder="Short summary"></textarea>
          <textarea id="body" rows="8" placeholder="Write your article here..." required></textarea>

          <div class="upload-box">
            <label for="imageUpload">Upload image</label>
            <input id="imageUpload" type="file" accept="image/*" />
            <img id="imagePreview" alt="Image preview" class="hidden" />
          </div>

          <div class="ad-slot admin-ad-slot">
            <span>AdSense Slot 1</span>
          </div>
          <div class="ad-slot admin-ad-slot">
            <span>AdSense Slot 2</span>
          </div>

          <button type="submit" class="button primary">Save story</button>
        </form>
      </section>

      <aside class="admin-panel-card">
        <h2>Recent stories</h2>
        <div id="articleList" class="article-list"></div>
        <div class="ad-slot admin-ad-slot sidebar-ad">
          <span>Sidebar Ad</span>
        </div>
      </aside>
    </div>
  </div>
</section>

<script src="/assets/js/admin-panel.js" defer></script>
