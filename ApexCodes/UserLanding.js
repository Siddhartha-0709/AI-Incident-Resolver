// const userId = $v(P9_USER_ID); // Assuming $v(P9_USER_ID) correctly provides the user ID

// var spinner = apex.util.showSpinner();

// fetch(`https://proxy-route-eta.vercel.app/api/get-incident-by-assigned-to?assignedTo=${userId}`, {
//   method: "GET",
//   headers: {
//     "Content-Type": "application/json"
//   },
// })
//   .then(response => response.json())
//   .then(data => {
//     spinner.remove();
//     const container = document.getElementById("dynamic");
//     if (!Array.isArray(data) || data.length === 0) {
//       container.innerHTML = `<p>No incidents assigned to you yet.</p>`;
//       return;
//     }

//     // ✅ Count total, open, and resolved
//     const totalIncidents = data.length;
//     const openIncidents = data.filter(inc => inc.status.toUpperCase() === "OPEN").length;
//     const resolvedIncidents = totalIncidents - openIncidents;

//     // ✅ Build summary section with Bootstrap badges
//     let html = `
//       <h5>Incident Summary</h5>
//       <p>
//         <span class="badge bg-primary">Total: ${totalIncidents}</span>
//         <span class="badge bg-danger">Open: ${openIncidents}</span>
//         <span class="badge bg-success">Resolved: ${resolvedIncidents}</span>
//       </p>
//       <hr>
//       <h5>Assigned Incidents:</h5>
//     `;

//     html += `<div class="accordion" id="assignedIncidentsAccordion">`;

//     data.forEach((incident, i) => {
//       const headingId = `heading${i}`;
//       const collapseId = `collapse${i}`;
//       const isOpen = incident.status.toUpperCase() === "OPEN";
//       const redDot = isOpen ? `<span class="status-dot bg-danger"></span>` : "";

//       const buttonClass = isOpen ? "accordion-button" : "accordion-button text-success";
//       const buttonLabel = isOpen ? "OPEN" : "RESOLVED";

//       html += `
//         <div class="accordion-item">
//           <h2 class="accordion-header" id="${headingId}">
//             <button class="${buttonClass} ${i === 0 ? '' : 'collapsed'}" 
//                     type="button" data-bs-toggle="collapse" 
//                     data-bs-target="#${collapseId}" 
//                     aria-expanded="${i === 0 ? 'true' : 'false'}" 
//                     aria-controls="${collapseId}">
//               ${incident.title} ${redDot}
//             </button>
//           </h2>
//           <div id="${collapseId}" 
//                class="accordion-collapse collapse ${i === 0 ? 'show' : ''}" 
//                aria-labelledby="${headingId}" 
//                data-bs-parent="#assignedIncidentsAccordion">
//             <div class="accordion-body">
//               <p><b>Incident ID:</b> ${incident._id}</p>
//               <p><b>Description:</b> ${incident.description}</p>
//               <p><b>Issued By:</b> ${incident.issuedBy}</p>
//               <p><b>Status:</b> ${incident.status}</p>
//               <p><b>AI Helping Tips:</b></p>
//               <ul>
//                 ${incident.aiHelpingTips.map(tip => `<li>${tip}</li>`).join("")}
//               </ul>
//             </div>
//           </div>
//         </div>
//       `;
//     });

//     html += `</div>`;
//     container.innerHTML = html;
//   })
//   .catch(err => {
//     console.error(err);
//     spinner.remove();
//     document.getElementById("dynamic").innerHTML = `<p style="color: red;">Error fetching incidents: ${err.message}</p>`;
//   });


// const userId = $v(P9_USER_ID); // Assuming $v(P9_USER_ID) correctly provides the user ID

// var spinner = apex.util.showSpinner();

// fetch(`https://proxy-route-eta.vercel.app/api/get-incident-by-assigned-to?assignedTo=${userId}`, {
//   method: "GET",
//   headers: {
//     "Content-Type": "application/json"
//   },
// })
//   .then(response => response.json())
//   .then(data => {
//     spinner.remove();
//     const container = document.getElementById("dynamic");
//     if (!Array.isArray(data) || data.length === 0) {
//       container.innerHTML = `<p>No incidents assigned to you yet.</p>`;
//       return;
//     }

//     let html = `<h5>Assigned Incidents:</h5>`;
//     html += `<div class="accordion" id="assignedIncidentsAccordion">`;

//     data.forEach((incident, i) => {
//       const headingId = `heading${i}`;
//       const collapseId = `collapse${i}`;
//       const isOpen = incident.status.toUpperCase() === "OPEN";
//       const redDot = isOpen ? `<span class="status-dot bg-danger"></span>` : "";

//       const buttonClass = isOpen ? "accordion-button" : "accordion-button text-success";
//       const buttonLabel = isOpen ? "OPEN" : "RESOLVED";

//       html += `
//         <div class="accordion-item">
//           <h2 class="accordion-header" id="${headingId}">
//             <button class="${buttonClass} ${i === 0 ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#${collapseId}" aria-expanded="${i === 0 ? 'true' : 'false'}" aria-controls="${collapseId}">
//               ${incident.title} ${redDot} 
//             </button>
//           </h2>
//           <div id="${collapseId}" class="accordion-collapse collapse ${i === 0 ? 'show' : ''}" aria-labelledby="${headingId}" data-bs-parent="#assignedIncidentsAccordion">
//             <div class="accordion-body">
//               <p><b>Incident ID:</b> ${incident._id}</p>
//               <p><b>Description:</b> ${incident.description}</p>
//               <p><b>Issued By:</b> ${incident.issuedBy}</p>
//               <p><b>Status:</b> ${incident.status}</p>
//               <p><b>AI Helping Tips:</b></p>
//               <ul>
//                 ${incident.aiHelpingTips.map(tip => `<li>${tip}</li>`).join("")}
//               </ul>
//             </div>
//           </div>
//         </div>
//       `;
//     });

//     html += `</div>`;
//     container.innerHTML = html;
//   })
//   .catch(err => {
//     console.error(err);
//     spinner.remove();
//     document.getElementById("dynamic").innerHTML = `<p style="color: red;">Error fetching incidents: ${err.message}</p>`;
//   });
