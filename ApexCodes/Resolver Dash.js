const userId = $v(P9_USER_ID);
var spinner = apex.util.showSpinner();
fetch(`https://proxy-route-eta.vercel.app/api/get-incident-by-assigned-to?assignedTo=${userId}`, {
  method: "GET",
  headers: {
    "Content-Type": "application/json"
  },
})
  .then(response => response.json())
  .then(data => {
    spinner.remove();
    const container = document.getElementById("dynamic");
    if (!Array.isArray(data) || data.length === 0) {
      container.innerHTML = `<p>No incidents assigned to you yet.</p>`;
      return;
    }

    // ✅ UI Controls (Filter + Sort)
    let html = `
      <div class="d-flex justify-content-between align-items-center mb-3">
        <div>
          <label class="form-label fw-bold me-2">Filter by Status:</label>
          <select id="incidentFilter" class="form-select d-inline-block w-auto">
            <option value="ALL">All</option>
            <option value="OPEN">Open</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </div>
        <div>
          <label class="form-label fw-bold me-2">Sort by Date:</label>
          <select id="incidentSort" class="form-select d-inline-block w-auto">
            <option value="DESC">Newest First</option>
            <option value="ASC">Oldest First</option>
          </select>
        </div>
      </div>
      <div id="incidentContent"></div>
    `;
    container.innerHTML = html;
    const incidentContent = document.getElementById("incidentContent");
    // ✅ Render function with filter + sort
    function renderIncidents() {
      const filterValue = document.getElementById("incidentFilter").value;
      const sortValue = document.getElementById("incidentSort").value;
      let filteredData = [...data];
      // Filtering
      if (filterValue === "OPEN") {
        filteredData = filteredData.filter(inc => inc.status.toUpperCase() === "OPEN");
      } else if (filterValue === "RESOLVED") {
        filteredData = filteredData.filter(inc => inc.status.toUpperCase() !== "OPEN");
      }
      // Sorting
      filteredData.sort((a, b) => {
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortValue === "ASC" ? dateA - dateB : dateB - dateA;
      });
      if (filteredData.length === 0) {
        incidentContent.innerHTML = `<p>No incidents found with this filter.</p>`;
        return;
      }
      // ✅ Count total, open, and resolved
      const totalIncidents = filteredData.length;
      const openIncidents = filteredData.filter(inc => inc.status.toUpperCase() === "OPEN").length;
      const resolvedIncidents = totalIncidents - openIncidents;
      let html = `
        <h5>Incident Summary</h5>
        <p>
          <span class="badge bg-primary">Total: ${totalIncidents}</span>
          <span class="badge bg-danger">Open: ${openIncidents}</span>
          <span class="badge bg-success">Resolved: ${resolvedIncidents}</span>
        </p>
        <hr>
        <h5>Assigned Incidents:</h5>
      `;
      html += `<div class="accordion" id="assignedIncidentsAccordion">`;
      filteredData.forEach((incident, i) => {
        const headingId = `heading${i}`;
        const collapseId = `collapse${i}`;
        const isOpen = incident.status.toUpperCase() === "OPEN";
        const redDot = isOpen ? `<span class="status-dot bg-danger"></span>` : "";
        const buttonClass = isOpen ? "accordion-button" : "accordion-button text-success";
        html += `
          <div class="accordion-item">
            <h2 class="accordion-header" id="${headingId}">
              <button class="${buttonClass} ${i === 0 ? '' : 'collapsed'}" 
                      type="button" data-bs-toggle="collapse" 
                      data-bs-target="#${collapseId}" 
                      aria-expanded="${i === 0 ? 'true' : 'false'}" 
                      aria-controls="${collapseId}">
                ${incident.title} ${redDot}
              </button>
            </h2>
            <div id="${collapseId}" 
                 class="accordion-collapse collapse ${i === 0 ? 'show' : ''}" 
                 aria-labelledby="${headingId}" 
                 data-bs-parent="#assignedIncidentsAccordion">
              <div class="accordion-body">
                <p><b>Incident ID:</b> ${incident._id}</p>
                <p><b>Description:</b> ${incident.description}</p>
                <p><b>Issued By:</b> ${incident.issuedBy}</p>
                <p><b>Status:</b> ${incident.status}</p>
                <p><b>Created At:</b> ${new Date(incident.createdAt).toLocaleString()}</p>
                <p><b>AI Helping Tips:</b></p>
                <ul>
                  ${incident.aiHelpingTips.map(tip => `<li>${tip}</li>`).join("")}
                </ul>
              </div>
            </div>
          </div>
        `;
      });
      html += `</div>`;
      incidentContent.innerHTML = html;
    }
    // Initial render
    renderIncidents();
    // Event Listeners for filter and sort
    document.getElementById("incidentFilter").addEventListener("change", renderIncidents);
    document.getElementById("incidentSort").addEventListener("change", renderIncidents);
  })
  .catch(err => {
    console.error(err);
    spinner.remove();
    document.getElementById("dynamic").innerHTML = `<p style="color: red;">Error fetching incidents: ${err.message}</p>`;
  });




  fetch(`https://proxy-route-eta.vercel.app/api/get-incident-by-assigned-to?assignedTo=${$v('P9_USER_ID')}`)
