"use strict";

/* =========================================================
   CAREERLIFT PUBLIC WEBSITE
   Jobs + Resources + Contact
   ========================================================= */

const supabaseClient = window.supabaseClient;

/* ---------- Helpers ---------- */

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, function (char) {
        return {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        }[char];
    });
}

function formatDate(date) {
    if (!date) return "";

    try {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric"
        });
    } catch {
        return "";
    }
}

function showEmpty(container, message) {
    if (!container) return;

    container.innerHTML = `
        <div class="empty-state">
            <div class="empty-icon">📂</div>
            <h3>${escapeHTML(message)}</h3>
            <p>New resources will appear here when published.</p>
        </div>
    `;
}

/* =========================================================
   RESOURCES
   ========================================================= */

async function loadResources() {

    const grid = document.getElementById("resourcesGrid");

    if (!grid) return;

    if (!supabaseClient) {
        showEmpty(grid, "Resources are temporarily unavailable.");
        console.error("Supabase client not initialized.");
        return;
    }

    grid.innerHTML = `
        <div class="resource-loading">
            <div class="loading-spinner"></div>
            <p>Loading resources...</p>
        </div>
    `;

    try {

        const { data, error } = await supabaseClient
            .from("resources")
            .select(`
                id,
                title,
                type,
                resource_url,
                image_url,
                description,
                created_at
            `)
            .order("created_at", {
                ascending: false
            });

        if (error) {
            console.error("Resources error:", error);

            grid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">⚠️</div>
                    <h3>Unable to load resources</h3>
                    <p>${escapeHTML(error.message)}</p>
                </div>
            `;

            return;
        }

        if (!data || data.length === 0) {
            showEmpty(grid, "No resources yet.");
            return;
        }

        grid.innerHTML = data.map(resource => {

            const title = escapeHTML(resource.title);
            const type = escapeHTML(resource.type || "Resource");
            const description = escapeHTML(
                resource.description || "Useful career resource shared by CAREERLIFT."
            );

            const url = escapeHTML(resource.resource_url || "");
            const imageUrl = escapeHTML(resource.image_url || "");

            const isImage =
                type.toLowerCase() === "image" ||
                /\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(
                    resource.resource_url || ""
                );

            const isPDF =
                type.toLowerCase() === "pdf" ||
                /\.pdf(\?.*)?$/i.test(
                    resource.resource_url || ""
                );

            let preview = "";

            /* ---------- IMAGE ---------- */

            if (isImage && imageUrl) {

                preview = `
                    <div class="resource-preview image-preview">
                        <img
                            src="${imageUrl}"
                            alt="${title}"
                            loading="lazy"
                            onerror="this.parentElement.innerHTML='<div class=&quot;file-icon&quot;>🖼️</div>'"
                        >
                    </div>
                `;

            }

            /* ---------- PDF ---------- */

            else if (isPDF) {

                preview = `
                    <div class="resource-preview pdf-preview">
                        <div class="pdf-icon">PDF</div>
                        <span>PDF DOCUMENT</span>
                    </div>
                `;

            }

            /* ---------- OTHER ---------- */

            else {

                preview = `
                    <div class="resource-preview">
                        <div class="file-icon">📚</div>
                    </div>
                `;

            }

            return `
                <article class="resource-card reveal">

                    ${preview}

                    <div class="resource-content">

                        <div class="resource-meta">
                            <span class="resource-type">
                                ${type}
                            </span>

                            <span>
                                ${formatDate(resource.created_at)}
                            </span>
                        </div>

                        <h3>
                            ${title}
                        </h3>

                        <p>
                            ${description}
                        </p>

                        <div class="resource-actions">

                            <a
                                class="btn primary resource-btn"
                                href="${url}"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                ${isPDF ? "📄 Open PDF" : "↗ Open Resource"}
                            </a>

                            <a
                                class="btn secondary resource-btn"
                                href="${url}"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                View ↗
                            </a>

                        </div>

                    </div>

                </article>
            `;

        }).join("");

        /* Animate cards after rendering */
        requestAnimationFrame(() => {
            document
                .querySelectorAll("#resourcesGrid .resource-card")
                .forEach((card, index) => {

                    card.style.animationDelay =
                        `${index * 0.08}s`;

                    card.classList.add("resource-visible");
                });
        });

    } catch (error) {

        console.error("Unexpected resource error:", error);

        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">⚠️</div>
                <h3>Something went wrong</h3>
                <p>Please try again later.</p>
            </div>
        `;
    }
}


/* =========================================================
   JOBS
   ========================================================= */

let allJobs = [];

async function loadJobs() {

    const grid = document.getElementById("jobsGrid");

    if (!grid || !supabaseClient) return;

    grid.innerHTML = `
        <div class="resource-loading">
            <div class="loading-spinner"></div>
            <p>Loading jobs...</p>
        </div>
    `;

    try {

        const { data, error } = await supabaseClient
            .from("jobs")
            .select("*")
            .order("created_at", {
                ascending: false
            });

        if (error) {
            console.error("Jobs error:", error);

            grid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">⚠️</div>
                    <h3>Unable to load jobs</h3>
                    <p>${escapeHTML(error.message)}</p>
                </div>
            `;

            return;
        }

        allJobs = data || [];

        renderJobs(allJobs);

    } catch (error) {

        console.error(error);

        grid.innerHTML = `
            <div class="empty-state">
                <h3>Unable to load jobs</h3>
            </div>
        `;
    }
}


function renderJobs(jobs) {

    const grid = document.getElementById("jobsGrid");

    if (!grid) return;

    if (!jobs.length) {

        grid.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">💼</div>
                <h3>No jobs found</h3>
                <p>New opportunities will appear here.</p>
            </div>
        `;

        return;
    }

    grid.innerHTML = jobs.map(job => {

        return `
            <article class="job-card">

                <div class="job-card-top">

                    <div class="job-icon">
                        💼
                    </div>

                    <span class="job-category">
                        ${escapeHTML(job.category || "Job")}
                    </span>

                </div>

                <h3>
                    ${escapeHTML(job.title || "Job Opportunity")}
                </h3>

                <p class="job-company">
                    ${escapeHTML(job.company || "CAREERLIFT")}
                </p>

                <div class="job-details">

                    ${job.location ? `
                        <span>📍 ${escapeHTML(job.location)}</span>
                    ` : ""}

                    ${job.qualification ? `
                        <span>🎓 ${escapeHTML(job.qualification)}</span>
                    ` : ""}

                    ${job.experience ? `
                        <span>💼 ${escapeHTML(job.experience)}</span>
                    ` : ""}

                    ${job.salary ? `
                        <span>💰 ${escapeHTML(job.salary)}</span>
                    ` : ""}

                </div>

                ${job.last_date ? `
                    <div class="job-deadline">
                        ⏰ Last Date: ${escapeHTML(job.last_date)}
                    </div>
                ` : ""}

                <div class="job-actions">

                    <a
                        class="btn primary"
                        href="${escapeHTML(job.apply_url || "#")}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Apply Now ↗
                    </a>

                </div>

            </article>
        `;

    }).join("");
}


/* =========================================================
   JOB SEARCH
   ========================================================= */

const searchInput = document.getElementById("search");

if (searchInput) {

    searchInput.addEventListener("input", function () {

        const query = this.value
            .trim()
            .toLowerCase();

        if (!query) {
            renderJobs(allJobs);
            return;
        }

        const filtered = allJobs.filter(job => {

            return (
                String(job.title || "")
                    .toLowerCase()
                    .includes(query) ||

                String(job.company || "")
                    .toLowerCase()
                    .includes(query) ||

                String(job.category || "")
                    .toLowerCase()
                    .includes(query) ||

                String(job.location || "")
                    .toLowerCase()
                    .includes(query)
            );

        });

        renderJobs(filtered);
    });
}


/* =========================================================
   CATEGORY FILTER
   ========================================================= */

document.querySelectorAll("[data-category]").forEach(button => {

    button.addEventListener("click", function () {

        const category = this.dataset.category;

        const filtered = allJobs.filter(job =>
            String(job.category || "")
                .toLowerCase() ===
            category.toLowerCase()
        );

        document.getElementById("jobs")
            ?.scrollIntoView({
                behavior: "smooth"
            });

        renderJobs(filtered);

    });

});


/* =========================================================
   CONTACT
   ========================================================= */

async function loadContact() {

    const container =
        document.getElementById("contactItems");

    if (!container || !supabaseClient) return;

    try {

        const { data, error } = await supabaseClient
            .from("contacts")
            .select("*")
            .eq("is_active", true)
            .order("created_at", {
                ascending: false
            })
            .limit(1)
            .maybeSingle();

        if (error) {
            console.error("Contact error:", error);
            return;
        }

        if (!data) {
            container.innerHTML = `
                <div class="contact-item">
                    <span>✉️</span>
                    <a href="mailto:careerliftupdates@gmail.com">
                        careerliftupdates@gmail.com
                    </a>
                </div>
            `;
            return;
        }

        container.innerHTML = `

            ${data.phone ? `
                <div class="contact-item">
                    <span>📞</span>
                    <a href="tel:${escapeHTML(data.phone)}">
                        ${escapeHTML(data.phone)}
                    </a>
                </div>
            ` : ""}

            ${data.email ? `
                <div class="contact-item">
                    <span>✉️</span>
                    <a href="mailto:${escapeHTML(data.email)}">
                        ${escapeHTML(data.email)}
                    </a>
                </div>
            ` : ""}

            ${data.telegram_url ? `
                <div class="contact-item">
                    <span>✈️</span>
                    <a
                        href="${escapeHTML(data.telegram_url)}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Telegram
                    </a>
                </div>
            ` : ""}

            ${data.whatsapp_url ? `
                <div class="contact-item">
                    <span>💬</span>
                    <a
                        href="${escapeHTML(data.whatsapp_url)}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        WhatsApp
                    </a>
                </div>
            ` : ""}

        `;

    } catch (error) {

        console.error(error);
    }
}


/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    loadJobs();

    loadResources();

    loadContact();

});
