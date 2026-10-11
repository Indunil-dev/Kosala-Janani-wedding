# 💍 Luxury Wedding E-Invitation Web App (invitation.lk Style)

A modern, mobile-first Sri Lankan wedding invitation web application built for seamless WhatsApp delivery and free hosting on **GitHub Pages**.

---

## ✨ Features (ප්‍රධාන විශේෂාංග)

1. **Luxury Mobile-First Design (ස්මාර්ට්ෆෝන් සඳහාම විශේෂිතයි)**:
   - Optimized for mobile viewing since 95%+ of guests open invitations on their smartphones.
   - Interactive Envelope with Wax Seal opening animation (මුද්‍රාව ඔබා විවෘත කිරීම).
   - Soft background romantic piano music with a floating mute/play toggle button.
2. **Personalized WhatsApp Links (එක් එක් අමුත්තාගේ නමින්ම විවෘත වන ලින්ක්)**:
   - Automatically displays the guest's name, reserved seat count, and table number right on the card (e.g. `?to=Mr.+Kasun+Silva&seats=2&table=04`).
3. **Pre-shoot Photos Gallery & Lightbox (ප්‍රී-ෂූට් ඡායාරූප ගැලරිය)**:
   - Touch-friendly responsive photo grid.
   - Tap any photo to open full-screen in a luxury lightbox view.
4. **Auspicious Live Countdown Timer (නැකතට පෙර දින ගණනය)**:
   - Real-time countdown (Days, Hours, Minutes, Seconds) until the auspicious Poruwa ceremony time.
5. **Event Timeline & Schedule (මංගල චාරිත්‍ර කාලසටහන)**:
   - Poruwa ceremony (පෝරුව චාරිත්‍ර), Marriage registration (ලියාපදිංචිය), Toast, Reception & Dancing.
6. **Venue & Google Maps Navigation (ස්ථානය සහ Google Maps)**:
   - Direct 1-tap "Open in Google Maps" button for easy guest navigation.
   - Direct "Add to Google Calendar" button.
7. **Instant RSVP via WhatsApp (කෙලින්ම WhatsApp එකට RSVP ලැබීම)**:
   - Guests can confirm attendance or send wishes, which opens their WhatsApp and sends a pre-formatted message directly to your phone number.
8. **Guest List Manager & WhatsApp Link Generator (`admin.html`)**:
   - Manage all your invitees in one place.
   - 1-click "Send on WhatsApp" button that automatically creates personalized text and opens the chat.
   - Export guest list to CSV / Excel.

---

## 🚀 How to Host on GitHub Pages for Free (විනාඩි 2කින් GitHub Pages දාගන්නේ මෙහෙමයි)

1. Create a new GitHub repository named `INV` (or whatever name you like).
2. Push or upload all files from this folder (`index.html`, `admin.html`, `css/`, `js/`, `README.md`) to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial wedding invitation app"
   git branch -M main
   git remote add origin https://github.com/<YOUR-GITHUB-USERNAME>/INV.git
   git push -u origin main
   ```
3. Go to your repository on GitHub:
   - Click **Settings** (ඉහළින් ඇති Settings ටැබ් එක)
   - Left menu එකෙන් **Pages** තෝරන්න.
   - Under **Build and deployment** -> **Branch**: Select `main` and `/ (root)`.
   - Click **Save**.
4. In about 1 minute, your site will be live at:
   `https://<YOUR-GITHUB-USERNAME>.github.io/INV/`

---

## 📸 How to Replace Pre-shoot Photos (ඔබගේ ඡායාරූප දාගන්නේ මෙහෙමයි)

### Couple Avatars (මනමාලයා සහ මනමාලිය):
In `index.html`, search for `The Bride & Groom`:
- Replace Groom photo URL in `<img src="..." alt="Groom Kasun">`
- Replace Bride photo URL in `<img src="..." alt="Bride Amaya">`

### Pre-shoot Gallery Photos (ප්‍රී-ෂූට් ඡායාරූප):
In `index.html`, search for `Pre-Shoot Photo Gallery`:
- You can place your photos in an `assets/images/` folder or upload them to Imgur / Google Drive / GitHub, and update the `src` attribute of each `<img>` tag:
  ```html
  <div class="gallery-item featured">
    <img src="assets/images/preshoot-1.jpg" alt="Couple 1">
  </div>
  ```

---

## ⚙️ How to Customize Names, Date, Venue & WhatsApp (`js/app.js`)

Open [js/app.js](file:///c:/Users/indun/Downloads/INV/js/app.js) and simply change the `WEDDING_CONFIG` settings at the top:

```javascript
window.WEDDING_CONFIG = {
  couple: {
    groom: "Kasun",
    bride: "Amaya",
    groomFull: "Kasun Kalhara",
    brideFull: "Amaya Perera",
    groomParents: "Son of Mr. & Mrs. Dharmadasa",
    brideParents: "Daughter of Mr. & Mrs. Perera"
  },
  // Wedding Date & Time (YYYY-MM-DDTHH:MM:SS)
  eventDate: "2026-11-28T08:45:00",
  poruwaTime: "08:45 AM",
  receptionTime: "12:30 PM",
  // Venue Details
  venue: {
    name: "The Grand Ballroom, Shangri-La Colombo",
    address: "1 Galle Face, Colombo 02, Sri Lanka",
    googleMapsUrl: "https://maps.google.com/?q=Shangri-La+Hotel+Colombo"
  },
  // Couple's WhatsApp Phone Number (Country Code + Number, no + sign)
  rsvpWhatsAppNumber: "94771234567"
};
```

---

## 📱 How to Send Invitations on WhatsApp (`admin.html`)

1. Open `admin.html` in your browser.
2. Click **Settings** and set your live GitHub Pages URL (e.g. `https://<YOUR-USERNAME>.github.io/INV/index.html`).
3. Enter your guest's name, WhatsApp phone number, and reserved seats, then click **+ Add Guest**.
4. Click the green **"Send on WhatsApp"** button next to each guest. It will automatically open WhatsApp with the personalized greeting and link ready to send in one tap!
5. You can also click **Copy Link** to share the link anywhere you want.
