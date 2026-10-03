const grid = document.getElementById("jobsGrid");
const search = document.getElementById("search");

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
      <span class="badge">${escapeHtml(job.category || "Job Update")}</span>
      <h3>${escapeHtml(job.title)}</h3>
      <div class="company">${escapeHtml(job.company || "")}</div>
      <div class="meta">
        ${job.location ? `<span>📍 ${escapeHtml(job.location)}</span>` : ""}
        ${job.qualification ? `<span>🎓 ${escapeHtml(job.qualification)}</span>` : ""}
        ${job.experience ? `<span>👤 ${escapeHtml(job.experience)}</span>` : ""}
      </div>
      <div class="job-bottom">
        <small>Last date: ${escapeHtml(job.last_date || "Check notification")}</small>
        <a class="apply" href="${safeUrl(job.apply_url)}" target="_blank" rel="noopener noreferrer">Apply →</a>
      </div>
    </article>
  `).join("");
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
