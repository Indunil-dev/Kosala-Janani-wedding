/**
 * Admin Panel & WhatsApp Guest List Manager
 * Custom for Kosala & Janani Wedding (Hotel Suneragira, Nikaweratiya)
 */

// Storage keys
const STORAGE_KEY_GUESTS = 'wedding_guest_list_kj';
const STORAGE_KEY_SETTINGS = 'wedding_admin_settings_kj';

// Default settings from wedding card
const DEFAULT_SETTINGS = {
  baseUrl: window.location.origin + window.location.pathname.replace('admin.html', 'index.html'),
  groomName: "Kosala",
  brideName: "Janani",
  weddingDate: "Thursday, 19th November 2026",
  venueName: "Hotel Suneragira, Nikaweratiya",
  customMessageTemplate: `🌸 *Wedding Invitation - {GROOM} & {BRIDE}*

Dear {GUEST_NAME},

"We invite you to share with us this joyful and touching day of our wedding!"

Please tap the link below to view your personalized digital invitation:
🔗 {INVITATION_URL}

📅 Date: {DATE}
⏰ Time: 9.30 AM – 3.30 PM
📍 Venue: {VENUE}
Reserved Seats: {SEATS}

We look forward to celebrating with you! ✨`
};

// Initial sample guest data
const INITIAL_GUESTS = [
  { id: '1', name: "Mr. & Mrs. Sunimal Fernando", phone: "94771234567", seats: 2, table: "03", category: "Groom Family", sent: true },
  { id: '2', name: "Dr. Nuwan Senanayake & Family", phone: "94712345678", seats: 3, table: "05", category: "Bride Friends", sent: false },
  { id: '3', name: "Kavindu & Amaya", phone: "94769876543", seats: 2, table: "02", category: "Colleagues", sent: true },
  { id: '4', name: "Uncle Gamini & Family", phone: "94701112233", seats: 4, table: "01", category: "Relatives", sent: false }
];

let guests = [];
let settings = {};

document.addEventListener("DOMContentLoaded", () => {
  loadSettings();
  loadGuests();
  initFormHandlers();
  initSettingsModal();
  renderDashboard();
});

function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_SETTINGS);
    settings = saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : { ...DEFAULT_SETTINGS };
    
    if (!settings.baseUrl || settings.baseUrl.includes('admin.html')) {
      settings.baseUrl = window.location.href.replace(/admin\.html.*$/, 'index.html');
    }
  } catch (e) {
    settings = { ...DEFAULT_SETTINGS };
  }
}

function saveSettings() {
  localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
}

function loadGuests() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY_GUESTS);
    guests = saved ? JSON.parse(saved) : [...INITIAL_GUESTS];
  } catch (e) {
    guests = [...INITIAL_GUESTS];
  }
}

function saveGuests() {
  localStorage.setItem(STORAGE_KEY_GUESTS, JSON.stringify(guests));
  renderDashboard();
}

/**
 * Generate Personalized Invitation URL for a Guest
 */
function generateGuestUrl(guest) {
  let base = settings.baseUrl;
  if (!base.endsWith('index.html') && !base.endsWith('/')) {
    base += '/';
  }
  const url = new URL(base, window.location.href);
  url.searchParams.set('to', guest.name);
  url.searchParams.set('seats', guest.seats.toString());
  if (guest.table) {
    url.searchParams.set('table', guest.table);
  }
  return url.toString();
}

/**
 * Format WhatsApp Message with Guest Details
 */
function formatWhatsAppMessage(guest) {
  const guestUrl = generateGuestUrl(guest);
  let msg = settings.customMessageTemplate;
  msg = msg.replace(/{GROOM}/g, settings.groomName);
  msg = msg.replace(/{BRIDE}/g, settings.brideName);
  msg = msg.replace(/{GUEST_NAME}/g, guest.name);
  msg = msg.replace(/{INVITATION_URL}/g, guestUrl);
  msg = msg.replace(/{DATE}/g, settings.weddingDate);
  msg = msg.replace(/{VENUE}/g, settings.venueName);
  msg = msg.replace(/{SEATS}/g, guest.seats.toString());
  return msg;
}

/**
 * Clean Phone Number for WhatsApp (e.g., 0771234567 -> 94771234567)
 */
function formatPhoneNumberForWhatsApp(phone) {
  let clean = phone.replace(/[^0-9]/g, '');
  if (clean.startsWith('0')) {
    clean = '94' + clean.substring(1);
  }
  return clean;
}

/**
 * Render Guests Table & Summary Cards
 */
function renderDashboard() {
  const guestTableBody = document.getElementById('guest-table-body');
  const searchInput = document.getElementById('guest-search');
  const filterCategory = document.getElementById('filter-category');

  // Stats calculation
  const totalGuests = guests.length;
  const totalSeats = guests.reduce((sum, g) => sum + parseInt(g.seats || 0), 0);
  const sentCount = guests.filter(g => g.sent).length;
  const pendingCount = totalGuests - sentCount;

  document.getElementById('stat-total-guests').textContent = totalGuests;
  document.getElementById('stat-total-seats').textContent = totalSeats;
  document.getElementById('stat-sent-links').textContent = sentCount;
  document.getElementById('stat-pending-links').textContent = pendingCount;

  // Filter items
  const query = (searchInput ? searchInput.value : '').toLowerCase();
  const selectedCat = filterCategory ? filterCategory.value : 'all';

  const filteredGuests = guests.filter(g => {
    const matchQuery = g.name.toLowerCase().includes(query) || (g.phone && g.phone.includes(query));
    const matchCat = selectedCat === 'all' || g.category === selectedCat;
    return matchQuery && matchCat;
  });

  if (!guestTableBody) return;

  if (filteredGuests.length === 0) {
    guestTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-8 text-slate-400 text-sm">
          No guests found. Click "Add New Guest" or "Load Samples" above.
        </td>
      </tr>
    `;
    return;
  }

  guestTableBody.innerHTML = filteredGuests.map(g => {
    const guestUrl = generateGuestUrl(g);
    const cleanPhone = formatPhoneNumberForWhatsApp(g.phone || '');
    const waMessage = encodeURIComponent(formatWhatsAppMessage(g));
    const waLink = cleanPhone ? `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${waMessage}` : `https://api.whatsapp.com/send?text=${waMessage}`;

    return `
      <tr class="border-b border-slate-100 hover:bg-slate-50/70 transition">
        <!-- Guest Name & Cat -->
        <td class="py-3 px-4">
          <div class="font-semibold text-slate-800 text-sm">${escapeHtml(g.name)}</div>
          <div class="flex items-center gap-1.5 mt-0.5">
            <span class="inline-block text-[11px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 font-medium">
              ${escapeHtml(g.category || 'General')}
            </span>
            ${g.table ? `<span class="text-[11px] text-amber-700 font-medium">Table ${g.table}</span>` : ''}
          </div>
        </td>

        <!-- Seats -->
        <td class="py-3 px-4 text-center">
          <span class="inline-flex items-center justify-center w-7 h-7 rounded-full bg-purple-50 text-purple-800 font-bold text-xs border border-purple-200">
            ${g.seats}
          </span>
        </td>

        <!-- Phone -->
        <td class="py-3 px-4 text-xs font-mono text-slate-600">
          ${g.phone ? escapeHtml(g.phone) : '<span class="text-slate-300">No phone</span>'}
        </td>

        <!-- Sent Status Badge -->
        <td class="py-3 px-4 text-center">
          <button onclick="toggleSentStatus('${g.id}')" class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition ${g.sent ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}">
            <span>${g.sent ? '✅ Sent' : '⏳ Pending'}</span>
          </button>
        </td>

        <!-- 1-Click WhatsApp Action -->
        <td class="py-3 px-4 text-center">
          <a href="${waLink}" target="_blank" onclick="markGuestSent('${g.id}')" class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs shadow-sm transition">
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.149.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.768-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.718.068-2.316-.593-1.688-.698-2.767-2.42-2.851-2.534-.085-.114-.683-.909-.683-1.733s.434-1.229.588-1.398c.154-.17.336-.212.449-.212.112 0 .224.001.322.006.104.005.244-.039.38.29.144.347.491 1.2.534 1.287.043.087.072.188.014.303-.058.115-.087.187-.173.288-.086.101-.182.226-.26.303-.086.086-.176.18-.076.353.1.172.444.733.953 1.187.655.584 1.208.765 1.38.851.172.086.273.072.374-.044.101-.115.432-.503.547-.676.115-.173.231-.144.389-.086.158.057 1.006.474 1.179.56.173.086.288.13.331.202.043.072.043.418-.101.823z"/></svg>
            <span>Send on WhatsApp</span>
          </a>
        </td>

        <!-- More Actions (Copy / Preview / Delete) -->
        <td class="py-3 px-4 text-right">
          <div class="inline-flex items-center gap-1.5">
            <button onclick="copyGuestLink('${escapeHtml(guestUrl)}')" title="Copy Personal Link" class="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
            </button>
            <a href="${guestUrl}" target="_blank" title="Preview Invitation" class="p-1.5 rounded-lg text-slate-500 hover:text-purple-700 hover:bg-purple-50 transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
            </a>
            <button onclick="deleteGuest('${g.id}')" title="Delete Guest" class="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
            </button>
          </div>
        </td>
      </tr>
    `;
  }).join('');
}

function initFormHandlers() {
  const addForm = document.getElementById('add-guest-form');
  const searchInput = document.getElementById('guest-search');
  const filterCat = document.getElementById('filter-category');

  if (addForm) {
    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('new-guest-name').value.trim();
      const phone = document.getElementById('new-guest-phone').value.trim();
      const seats = parseInt(document.getElementById('new-guest-seats').value || 2);
      const table = document.getElementById('new-guest-table').value.trim();
      const category = document.getElementById('new-guest-category').value;

      if (!name) return;

      const newGuest = {
        id: Date.now().toString(),
        name,
        phone,
        seats,
        table,
        category,
        sent: false
      };

      guests.unshift(newGuest);
      saveGuests();
      addForm.reset();
      showToast("Guest added successfully!");
    });
  }

  if (searchInput) searchInput.addEventListener('input', renderDashboard);
  if (filterCat) filterCat.addEventListener('change', renderDashboard);
}

function toggleSentStatus(id) {
  const g = guests.find(item => item.id === id);
  if (g) {
    g.sent = !g.sent;
    saveGuests();
  }
}

function markGuestSent(id) {
  const g = guests.find(item => item.id === id);
  if (g && !g.sent) {
    g.sent = true;
    saveGuests();
  }
}

function deleteGuest(id) {
  if (confirm("Are you sure you want to remove this guest from the list?")) {
    guests = guests.filter(g => g.id !== id);
    saveGuests();
    showToast("Guest removed");
  }
}

function copyGuestLink(url) {
  navigator.clipboard.writeText(url).then(() => {
    showToast("Personalized invitation link copied!");
  }).catch(() => {
    prompt("Copy this link:", url);
  });
}

function loadSampleGuests() {
  guests = [...INITIAL_GUESTS];
  saveGuests();
  showToast("Sample guests loaded!");
}

function clearAllGuests() {
  if (confirm("Are you sure you want to clear the entire guest list?")) {
    guests = [];
    saveGuests();
    showToast("Guest list cleared");
  }
}

// Export guests to CSV
function exportToCSV() {
  if (guests.length === 0) {
    alert("Guest list is empty!");
    return;
  }
  let csvContent = "data:text/csv;charset=utf-8,";
  csvContent += "Guest Name,Phone,Seats,Table,Category,Sent Status,Personal Link\n";

  guests.forEach(g => {
    const link = generateGuestUrl(g);
    const row = [
      `"${g.name.replace(/"/g, '""')}"`,
      `"${g.phone || ''}"`,
      g.seats,
      `"${g.table || ''}"`,
      `"${g.category || ''}"`,
      g.sent ? 'Sent' : 'Pending',
      `"${link}"`
    ].join(',');
    csvContent += row + "\n";
  });

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `Wedding_Guest_List_${settings.groomName}_${settings.brideName}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Settings Modal
function initSettingsModal() {
  const settingsBtn = document.getElementById('settings-btn');
  const modal = document.getElementById('settings-modal');
  const closeBtn = document.getElementById('close-settings-btn');
  const form = document.getElementById('settings-form');

  if (!modal) return;

  if (settingsBtn) {
    settingsBtn.addEventListener('click', () => {
      document.getElementById('setting-base-url').value = settings.baseUrl;
      document.getElementById('setting-groom').value = settings.groomName;
      document.getElementById('setting-bride').value = settings.brideName;
      document.getElementById('setting-venue').value = settings.venueName;
      document.getElementById('setting-template').value = settings.customMessageTemplate;
      modal.classList.remove('hidden');
    });
  }

  if (closeBtn) closeBtn.addEventListener('click', () => modal.classList.add('hidden'));

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      settings.baseUrl = document.getElementById('setting-base-url').value.trim();
      settings.groomName = document.getElementById('setting-groom').value.trim();
      settings.brideName = document.getElementById('setting-bride').value.trim();
      settings.venueName = document.getElementById('setting-venue').value.trim();
      settings.customMessageTemplate = document.getElementById('setting-template').value.trim();
      saveSettings();
      modal.classList.add('hidden');
      renderDashboard();
      showToast("Settings updated successfully!");
    });
  }
}

// Toast notification helper
function showToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 animate-fade-in flex items-center gap-2';
  toast.innerHTML = `<span>✨ ${escapeHtml(msg)}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 2800);
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str).replace(/[&<>"']/g, m => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
  })[m]);
}
