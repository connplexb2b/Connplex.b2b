const fs = require('fs');
const path = require('path');

const bundlePath = path.join(__dirname, '../temp_ticketing_bundle.js');
let content = fs.readFileSync(bundlePath, 'utf8');

const targetString = 'Z1=async(T1,fn,bn)=>{var u1,W1,E1,B1,O1,g1;const C1=P0==null?void 0:P0.find(R1=>(R1==null?void 0:R1.areaCatCode)===i0[T1].strAreaCode);((E1=(W1=(u1=i0[T1])==null?void 0:u1.rowData[fn])==null?void 0:W1.seatData[bn])==null?void 0:E1.strSeatStatus)==="0"?(k0(C1),i0[T1].strGroupSeatsData?(isCoupleSeats=!0,A0(i0[T1].area_price-i0[T1].priceTax1-i0[T1].priceTax2)):(console.log(":Himanshu aaaa"),A0(i0[T1].area_price-i0[T1].priceTax1-i0[T1].priceTax2)),X1(T1,fn,bn),M0.length<10?(x1(T1,fn,bn),p0(i0[T1].strAreaDesc)):M0.length===10&&l0===i0[T1].strAreaDesc&&K0(!0)):((g1=(O1=(B1=i0[T1])==null?void 0:B1.rowData[fn])==null?void 0:O1.seatData[bn])==null?void 0:g1.strSeatStatus)==="-1"&&N1(T1,fn,bn)},';

const replacementString = `Z1=async(T1,fn,bn)=>{
  var u1,W1,E1,B1,O1,g1;
  try {
    const seatObj = i0[T1].rowData[fn].seatData[bn];
    const rowName = i0[T1].rowData[fn].strRowPhyID || i0[T1].rowData[fn].strRowPhyId;
    const seatNumber = Number(seatObj.strSeatNumber);
    const status = seatObj.strSeatStatus;
    if (status === "1") {
      const cId = t0.state.cId;
      const showTime = t0.state.show_Time || "";
      const row = rowName.toUpperCase();
      const time = showTime.replace(/\\s+/g, ' ').toLowerCase();
      let isHni = false;
      if (cId === "65bcde931e72aef23e6854ee" && time === "9:00 pm") {
        if (["A", "B", "C", "D", "E", "F"].includes(row)) isHni = true;
      } else if (cId === "6a15837a2585fc9aa9c18b22" && time === "9:00 pm") {
        if (["C", "D", "E", "F", "G"].includes(row)) isHni = true;
        if (row === "H" && seatNumber >= 1 && seatNumber <= 5) isHni = true;
      } else if (cId === "664746aabddbaefe64f57506" && time === "8:00 pm") {
        if (["A", "B"].includes(row)) isHni = true;
      } else if (cId === "661667b087618af0798f1130" && time === "8:00 pm") {
        if (["A", "B"].includes(row)) isHni = true;
      } else if (cId === "67da83c720709248d1509053" && time === "9:10 pm") {
        if (["B", "C"].includes(row)) isHni = true;
      }
      if (isHni) {
        const overlay = document.createElement("div");
        overlay.id = "hni-popup-overlay";
        overlay.style.position = "fixed";
        overlay.style.top = "0";
        overlay.style.left = "0";
        overlay.style.width = "100%";
        overlay.style.height = "100%";
        overlay.style.backgroundColor = "rgba(0, 0, 0, 0.85)";
        overlay.style.backdropFilter = "blur(8px)";
        overlay.style.zIndex = "999999";
        overlay.style.display = "flex";
        overlay.style.alignItems = "center";
        overlay.style.justifyContent = "center";
        overlay.style.fontFamily = "'Outfit', sans-serif";
        overlay.style.color = "#fff";
        overlay.style.padding = "20px";
        overlay.style.boxSizing = "border-box";
        
        const modal = document.createElement("div");
        modal.style.background = "linear-gradient(135deg, #111 0%, #1c1c1c 100%)";
        modal.style.border = "2px solid #d4af37";
        modal.style.borderRadius = "16px";
        modal.style.padding = "30px";
        modal.style.maxWidth = "500px";
        modal.style.width = "100%";
        modal.style.boxShadow = "0 10px 30px rgba(212, 175, 55, 0.15)";
        modal.style.position = "relative";
        modal.style.textAlign = "center";
        modal.style.animation = "hniPopFadeIn 0.3s ease-out";
        
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = "@keyframes hniPopFadeIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }";
        document.head.appendChild(styleSheet);
        
        modal.innerHTML = \`
          <h2 style="color: #d4af37; font-size: 1.8rem; margin-top: 0; margin-bottom: 20px;">🎬 Wait! Don’t Miss This Exclusive Offer</h2>
          <p style="font-size: 1.1rem; color: #eee; margin-bottom: 20px; line-height: 1.5;">Book your HNI Premiere Night ticket for just ₹1,000 and receive:</p>
          <ul style="text-align: left; list-style: none; padding: 0; margin: 0 0 25px 0; font-size: 1.05rem; line-height: 1.8; color: #ccc;">
            <li style="margin-bottom: 8px;">✅ Premium food – <strong>FREE</strong></li>
            <li style="margin-bottom: 8px;">✅ Cold Drinks – <strong>FREE</strong></li>
            <li style="margin-bottom: 8px;">✅ Exclusive Goodie Bag Worth ₹1,200 – <strong>FREE</strong></li>
            <li style="margin-bottom: 8px;">✅ VIP Networking Experience</li>
            <li style="margin-bottom: 8px;">✅ Premiere Movie Screening</li>
          </ul>
          <div style="background: rgba(212, 175, 55, 0.1); border: 1px dashed #d4af37; padding: 12px; border-radius: 8px; margin-bottom: 25px;">
            <p style="margin: 0; font-size: 1.1rem; color: #fff;">Total Experience Value: <span style="text-decoration: line-through; color: #888;">₹2,200+</span></p>
            <p style="margin: 5px 0 0 0; font-size: 1.3rem; color: #d4af37; font-weight: bold;">Your Price: Only ₹1,000</p>
          </div>
          <p style="font-size: 1rem; color: #eee; margin-bottom: 20px; font-weight: bold;">🎟️ Limited Seats Available , 🎟️ Book Your Seat Now</p>
          <p style="font-size: 0.85rem; color: #aaa; margin-bottom: 25px;">Bookings are available exclusively through the HNI Event Page.</p>
          <div style="display: flex; gap: 15px; justify-content: center;">
            <button id="hni-btn-close" style="background: transparent; border: 1px solid #666; color: #ccc; padding: 12px 24px; border-radius: 8px; font-size: 1rem; cursor: pointer; transition: all 0.2s;">Cancel</button>
            <button id="hni-btn-book" style="background: #d4af37; border: none; color: #000; padding: 12px 28px; border-radius: 8px; font-size: 1rem; font-weight: bold; cursor: pointer; transition: all 0.2s; box-shadow: 0 4px 12px rgba(212, 175, 55, 0.3);">Book Now</button>
          </div>
        \`;
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        document.getElementById("hni-btn-close").addEventListener("click", () => {
          document.body.removeChild(overlay);
        });
        document.getElementById("hni-btn-book").addEventListener("click", () => {
          document.body.removeChild(overlay);
          const redirectUrl = (window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1")
            ? "http://localhost:3000/hni-events"
            : "https://connplex-b2b.vercel.app/hni-events";
          window.location.href = redirectUrl;
        });
        return;
      }
    }
  } catch (err) {
    console.error("HNI Intercept Error:", err);
  }
  const C1=P0==null?void 0:P0.find(R1=>(R1==null?void 0:R1.areaCatCode)===i0[T1].strAreaCode);((E1=(W1=(u1=i0[T1])==null?void 0:u1.rowData[fn])==null?void 0:W1.seatData[bn])==null?void 0:E1.strSeatStatus)==="0"?(k0(C1),i0[T1].strGroupSeatsData?(isCoupleSeats=!0,A0(i0[T1].area_price-i0[T1].priceTax1-i0[T1].priceTax2)):(console.log(":Himanshu aaaa"),A0(i0[T1].area_price-i0[T1].priceTax1-i0[T1].priceTax2)),X1(T1,fn,bn),M0.length<10?(x1(T1,fn,bn),p0(i0[T1].strAreaDesc)):M0.length===10&&l0===i0[T1].strAreaDesc&&K0(!0)):((g1=(O1=(B1=i0[T1])==null?void 0:B1.rowData[fn])==null?void 0:O1.seatData[bn])==null?void 0:g1.strSeatStatus)==="-1"&&N1(T1,fn,bn)},`;

if (content.includes(targetString)) {
  content = content.replace(targetString, replacementString);
  fs.writeFileSync(bundlePath, content, 'utf8');
  console.log("Success: HNI intercept successfully injected!");
} else {
  console.error("Error: Target string not found in bundle!");
}
