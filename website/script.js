const grid = document.getElementById("jobsGrid");
const resourceGrid = document.getElementById("resourcesGrid");
const search = document.getElementById("search");

const CATEGORY_ICONS = {
  "Government Jobs": "assets/government.svg",
  "Private Jobs": "assets/private.svg",
  "IT Jobs": "assets/it.svg",
  "Freshers Jobs": "assets/freshers.svg",
  "Work From Home": "assets/remote.svg",
  "Banking Jobs": "assets/banking.svg",
  "Internships": "assets/freshers.svg",
  "Other": "assets/it.svg"
};

function iconFor(category) {
  return CATEGORY_ICONS[category] || "assets/it.svg";
}

function imgWithFallback(src, alt, className = "") {
  const safeSrc = escapeHtml(src || "");
  const safeAlt = escapeHtml(alt || "CareerLift");
  return `<img class="${className}" src="${safeSrc}" alt="${safeAlt}"
    onerror="this.onerror=null;this.classList.add('image-fallback');this.removeAttribute('src');this.alt='';this.textContent='✦';">`;
}

async function loadJobs() {
  if (!window.supabaseClient) {
    grid.innerHTML = `<p style="color:var(--muted)">Connect Supabase to load live jobs.</p>`;
    return;
  }

  const { data, error } = await window.supabaseClient
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    grid.innerHTML = `<p style="color:var(--muted)">Unable to load jobs right now.</p>`;
    return;
  }

  window.allJobs = data || [];
  renderJobs(window.allJobs);
}

function renderJobs(list) {
  if (!list.length) {
    grid.innerHTML = `<p style="color:var(--muted)">No jobs posted yet.</p>`;
    return;
  }

  grid.innerHTML = list.map(job => `
    <article class="job-card reveal show">
      ${imgWithFallback(iconFor(job.category), `${job.category || "Job"} icon`, "job-icon")}
      <span class="badge">${escapeHtml(job.category || "Job Update")}</span>
      <h3>${escapeHtml(job.title || "Untitled opportunity")}</h3>
      <div class="company">${escapeHtml(job.company || "")}</div>
      <div class="meta">
        ${job.location ? `<span>📍 ${escapeHtml(job.location)}</span>` : ""}
        ${job.qualification ? `<span>🎓 ${escapeHtml(job.qualification)}</span>` : ""}
        ${job.experience ? `<span>👤 ${escapeHtml(job.experience)}</span>` : ""}
        ${job.salary ? `<span>💰 ${escapeHtml(job.salary)}</span>` : ""}
      </div>
      <div class="job-bottom">
        <small>Last date: ${escapeHtml(job.last_date || "Check notification")}</small>
        <a class="apply" href="${safeUrl(job.apply_url)}" target="_blank" rel="noopener noreferrer">Apply →</a>
      </div>
    </article>
  `).join("");
}

async function loadResources() {
  if (!resourceGrid) return;

  if (!window.supabaseClient) {
    resourceGrid.innerHTML = `
      <article class="resource-card">
        <div class="resource-body">
          ${imgWithFallback("assets/it.svg", "Resources icon", "resource-icon")}
          <h3>Career resources</h3>
          <p>Connect Supabase to display resources uploaded from the admin portal.</p>
        </div>
      </article>`;
    return;
  }

  const { data, error } = await window.supabaseClient
    .from("resources")
    .select("id,title,type,resource_url,image_url,description,created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    resourceGrid.innerHTML = `
      <article class="resource-card">
        <div class="resource-body">
          ${imgWithFallback("assets/it.svg", "Resources icon", "resource-icon")}
          <h3>Resource Hub</h3>
          <p>Resources could not be loaded right now. Please try again later.</p>
        </div>
      </article>`;
    return;
  }

  renderResources(data || []);
}

function renderResources(list) {
  if (!list.length) {
    resourceGrid.innerHTML = `
      <article class="resource-card">
        <div class="resource-body">
          ${imgWithFallback("assets/freshers.svg", "Study resources icon", "resource-icon")}
          <h3>Resources coming soon</h3>
          <p>PDFs, notes, interview guides, roadmaps and useful images will appear here after they are published from the admin portal.</p>
        </div>
      </article>`;
    return;
  }

  resourceGrid.innerHTML = list.map(resource => {
    const isImage = String(resource.type || "").toLowerCase() === "image";
    const preview = isImage && resource.image_url
      ? resource.image_url
      : iconFor("Freshers Jobs");

    return `
      <article class="resource-card reveal show">
        ${isImage
          ? imgWithFallback(preview, resource.title || "Resource image", "resource-preview")
          : `<div class="resource-preview image-fallback">📚</div>`}
        <div class="resource-body">
          ${imgWithFallback(iconFor("Freshers Jobs"), "Resource icon", "resource-icon")}
          <h3>${escapeHtml(resource.title || "Career resource")}</h3>
          <p>${escapeHtml(resource.description || `${resource.type || "Resource"} shared by CAREERLIFT.`)}</p>
          <a class="resource-link" href="${safeUrl(resource.resource_url)}" target="_blank" rel="noopener noreferrer">
            ${isImage ? "Open image" : "Open resource"} ↗
          </a>
        </div>
      </article>`;
  }).join("");
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#039;"
  }[c]));
}

function safeUrl(value) {
  try {
    const url = new URL(value);
    return ["http:", "https:"].includes(url.protocol) ? url.href : "#";
  } catch {
    return "#";
  }
}

function filterJobs() {
  const q = search.value.toLowerCase().trim();
  renderJobs((window.allJobs || []).filter(job =>
    Object.values(job).join(" ").toLowerCase().includes(q)
  ));
}

if (search) search.addEventListener("input", filterJobs);

document.querySelectorAll("[data-category]").forEach(button => {
  button.addEventListener("click", () => {
    search.value = button.dataset.category;
    filterJobs();
    document.getElementById("jobs").scrollIntoView({behavior:"smooth"});
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("show");
  });
}, {threshold:0.12});

document.querySelectorAll(".reveal").forEach(el => observer.observe(el));

loadJobs();
loadResources();
