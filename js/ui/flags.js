/* ==========================================================
   flags.js — Bandeiras em SVG
   ========================================================== */

// Emoji de bandeira a partir de um código de país (ex: "BR" -> 🇧🇷). Usado só quando temos o dado.
// Bandeiras desenhadas em SVG embutido (sem depender de internet) — funciona offline em qualquer
// plataforma (Android, iOS, desktop), diferente de emoji de bandeira (quebra no Windows) ou
// imagem externa (pode ser bloqueada em alguns previews de app).
const FLAG_SVG = {
AR:`<rect width="30" height="20" fill="#74acdf"/><rect y="6.67" width="30" height="6.67" fill="#fff"/><circle cx="15" cy="10" r="2.2" fill="#f6b40e" stroke="#85340a" stroke-width="0.3"/>`,
BE:`<rect width="10" height="20" fill="#000"/><rect x="10" width="10" height="20" fill="#fae042"/><rect x="20" width="10" height="20" fill="#ed2939"/>`,
BR:`<rect width="30" height="20" fill="#009b3a"/><polygon points="15,2.5 27.5,10 15,17.5 2.5,10" fill="#fedf00"/><circle cx="15" cy="10" r="4.5" fill="#002776"/>`,
CA:`<rect width="30" height="20" fill="#fff"/><rect width="7.5" height="20" fill="#ff0000"/><rect x="22.5" width="7.5" height="20" fill="#ff0000"/><path d="M15 5.5l1 2.2 2.3-1.1-.5 2.4 2.4.2-1.8 1.6 1.4 2-2.4-.4.2 2.4-1.6-1.7-1.6 1.7.2-2.4-2.4.4 1.4-2-1.8-1.6 2.4-.2-.5-2.4 2.3 1.1z" fill="#ff0000" stroke="#ff0000" stroke-width="0.3" stroke-linejoin="round"/>`,
CL:`<rect width="30" height="20" fill="#fff"/><rect y="10" width="30" height="10" fill="#d52b1e"/><rect width="10" height="10" fill="#0039a6"/><path d="M5 3.2l.8 2.4h2.5l-2 1.5.8 2.4-2.1-1.5-2.1 1.5.8-2.4-2-1.5h2.5z" fill="#fff"/>`,
CN:`<rect width="30" height="20" fill="#de2910"/><path d="M6 3l1.1 3.4h3.6L7.8 8.5 8.9 12 6 9.9 3.1 12l1.1-3.5L1.3 6.4h3.6z" fill="#ffde00"/><circle cx="12.5" cy="2.5" r="0.9" fill="#ffde00"/><circle cx="14.3" cy="4.7" r="0.9" fill="#ffde00"/><circle cx="14.3" cy="7.6" r="0.9" fill="#ffde00"/><circle cx="12.5" cy="9.6" r="0.9" fill="#ffde00"/>`,
CO:`<rect width="30" height="20" fill="#fcd116"/><rect y="10" width="30" height="5" fill="#003893"/><rect y="15" width="30" height="5" fill="#ce1126"/>`,
CZ:`<rect width="30" height="20" fill="#fff"/><rect y="10" width="30" height="10" fill="#d7141a"/><polygon points="0,0 15,10 0,20" fill="#11457e"/>`,
DE:`<rect width="30" height="6.67" fill="#000"/><rect y="6.67" width="30" height="6.67" fill="#dd0000"/><rect y="13.33" width="30" height="6.67" fill="#ffce00"/>`,
DK:`<rect width="30" height="20" fill="#c60c30"/><rect x="9" width="4" height="20" fill="#fff"/><rect y="8" width="30" height="4" fill="#fff"/>`,
DO:`<rect width="30" height="20" fill="#002d62"/><rect x="15" width="15" height="10" fill="#ce1126"/><rect y="10" width="15" height="10" fill="#ce1126"/><rect x="12" width="6" height="20" fill="#fff"/><rect y="7" width="30" height="6" fill="#fff"/>`,
EE:`<rect width="30" height="6.67" fill="#0072ce"/><rect y="6.67" width="30" height="6.67" fill="#000"/><rect y="13.33" width="30" height="6.67" fill="#fff"/>`,
ES:`<rect width="30" height="20" fill="#aa151b"/><rect y="5" width="30" height="10" fill="#f1bf00"/>`,
FI:`<rect width="30" height="20" fill="#fff"/><rect x="9" width="4" height="20" fill="#002f6c"/><rect y="8" width="30" height="4" fill="#002f6c"/>`,
FR:`<rect width="10" height="20" fill="#002395"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#ed2939"/>`,
GB:`<rect width="30" height="20" fill="#012169"/><path d="M0 0L30 20M30 0L0 20" stroke="#fff" stroke-width="3.5"/><path d="M0 0L30 20M30 0L0 20" stroke="#c8102e" stroke-width="1.3"/><path d="M15 0V20M0 10H30" stroke="#fff" stroke-width="5.5"/><path d="M15 0V20M0 10H30" stroke="#c8102e" stroke-width="3.2"/>`,
HK:`<rect width="30" height="20" fill="#de2910"/><g fill="#fff"><circle cx="15" cy="10" r="4.3"/></g><g fill="#de2910"><path d="M15 6.5l1 3-2.8-1.9h3.6L14 9.5z"/><path d="M18.5 8l-1.4 2.9-1-3.3 3 1.7-3 1.7z"/><path d="M18.5 12l-3-1.7 3.3-.9-1.7 3z"/><path d="M15 13.5l-1-3 2.8 1.9h-3.6l2.8-1.9z"/><path d="M11.5 12l1.4-2.9 1 3.3-3-1.7z"/></g>`,
ID:`<rect width="30" height="10" fill="#ce1126"/><rect y="10" width="30" height="10" fill="#fff"/>`,
IN:`<rect width="30" height="6.67" fill="#ff9933"/><rect y="6.67" width="30" height="6.67" fill="#fff"/><rect y="13.33" width="30" height="6.67" fill="#138808"/><circle cx="15" cy="10" r="2.2" fill="none" stroke="#000080" stroke-width="0.5"/>`,
KG:`<rect width="30" height="20" fill="#e8112d"/><circle cx="15" cy="10" r="4" fill="#fdef00"/><circle cx="15" cy="10" r="1.6" fill="#e8112d"/>`,
KH:`<rect width="30" height="4" fill="#032ea1"/><rect y="4" width="30" height="12" fill="#e00025"/><rect y="16" width="30" height="4" fill="#032ea1"/><rect x="12" y="7" width="6" height="6" fill="#fff"/>`,
KR:`<rect width="30" height="20" fill="#fff"/><circle cx="15" cy="10" r="3.5" fill="#c60c30"/><path d="M15 6.5a3.5 3.5 0 010 7 1.75 1.75 0 010-3.5 1.75 1.75 0 000-3.5z" fill="#003478"/>`,
LB:`<rect width="30" height="5" fill="#ee161f"/><rect y="5" width="30" height="10" fill="#fff"/><rect y="15" width="30" height="5" fill="#ee161f"/><path d="M15 7l1.3 3h3l-2.4 1.9.9 3-2.8-1.9-2.8 1.9.9-3L10.7 10h3z" fill="#00a651"/>`,
LT:`<rect width="30" height="6.67" fill="#fdb913"/><rect y="6.67" width="30" height="6.67" fill="#006a44"/><rect y="13.33" width="30" height="6.67" fill="#c1272d"/>`,
LV:`<rect width="30" height="20" fill="#9e3039"/><rect y="8.6" width="30" height="2.8" fill="#fff"/>`,
MA:`<rect width="30" height="20" fill="#c1272d"/><polygon points="15,6 16.1,8.6 19,8.9 16.8,10.7 17.5,13.5 15,11.9 12.5,13.5 13.2,10.7 11,8.9 13.9,8.6" fill="#006233"/><polygon points="15,7.3 15.7,9 17.4,9.2 16.1,10.3 16.5,12 15,11.1 13.5,12 13.9,10.3 12.6,9.2 14.3,9" fill="#c1272d"/>`,
MD:`<rect width="10" height="20" fill="#003da5"/><rect x="10" width="10" height="20" fill="#fdd105"/><rect x="20" width="10" height="20" fill="#cc092f"/><circle cx="15" cy="10" r="2.3" fill="#a0522d"/>`,
MY:`<rect width="30" height="20" fill="#fff"/><rect y="0" width="30" height="1.43" fill="#cc0001"/><rect y="2.86" width="30" height="1.43" fill="#cc0001"/><rect y="5.71" width="30" height="1.43" fill="#cc0001"/><rect y="8.57" width="30" height="1.43" fill="#cc0001"/><rect y="11.43" width="30" height="1.43" fill="#cc0001"/><rect y="14.29" width="30" height="1.43" fill="#cc0001"/><rect y="17.14" width="30" height="1.43" fill="#cc0001"/><rect width="15" height="11.4" fill="#010066"/><circle cx="7" cy="5.7" r="3.2" fill="#fc0"/><circle cx="8.3" cy="5.7" r="2.7" fill="#010066"/><polygon points="9.5,5.7 12.5,4.4 11.5,5.7 12.5,7" fill="#fc0"/>`,
NL:`<rect width="30" height="6.67" fill="#ae1c28"/><rect y="6.67" width="30" height="6.67" fill="#fff"/><rect y="13.33" width="30" height="6.67" fill="#21468b"/>`,
PH:`<polygon points="0,0 12,10 0,20" fill="#fff"/><rect y="0" width="30" height="10" x="10" fill="#0038a8" transform="translate(0,0)"/><rect x="10" y="0" width="20" height="10" fill="#0038a8"/><rect x="10" y="10" width="20" height="10" fill="#ce1126"/><circle cx="6" cy="10" r="1.8" fill="#fcd116"/>`,
PL:`<rect width="30" height="10" fill="#fff"/><rect y="10" width="30" height="10" fill="#dc143c"/>`,
PT:`<rect width="12" height="20" fill="#006600"/><rect x="12" width="18" height="20" fill="#ff0000"/><circle cx="12" cy="10" r="3.2" fill="#ffcc00" stroke="#fff" stroke-width="0.4"/>`,
RU:`<rect width="30" height="6.67" fill="#fff"/><rect y="6.67" width="30" height="6.67" fill="#0039a6"/><rect y="13.33" width="30" height="6.67" fill="#d52b1e"/>`,
SE:`<rect width="30" height="20" fill="#006aa7"/><rect x="10" width="4" height="20" fill="#fecc00"/><rect y="8" width="30" height="4" fill="#fecc00"/>`,
SG:`<rect width="30" height="10" fill="#ed2939"/><rect y="10" width="30" height="10" fill="#fff"/><circle cx="7" cy="5" r="3" fill="#fff"/><circle cx="8.3" cy="5" r="2.5" fill="#ed2939"/><polygon points="10,5 12.5,4.1 11.6,5 12.5,5.9" fill="#fff"/>`,
TH:`<rect width="30" height="20" fill="#a51931"/><rect y="3.33" width="30" height="13.33" fill="#fff"/><rect y="6.67" width="30" height="6.67" fill="#2d2a4a"/>`,
TR:`<rect width="30" height="20" fill="#e30a17"/><circle cx="12" cy="10" r="3.4" fill="#fff"/><circle cx="13" cy="10" r="2.8" fill="#e30a17"/><polygon points="16,10 19.5,8.8 17.3,10 19.5,11.2" fill="#fff"/>`,
TW:`<rect width="30" height="20" fill="#fe0000"/><rect width="15" height="10" fill="#000095"/><circle cx="7.5" cy="5" r="2.6" fill="#fff"/><circle cx="7.5" cy="5" r="1.8" fill="#000095"/>`,
UA:`<rect width="30" height="10" fill="#0057b7"/><rect y="10" width="30" height="10" fill="#ffd700"/>`,
US:`<rect width="30" height="20" fill="#fff"/><rect y="0" width="30" height="1.54" fill="#b22234"/><rect y="3.08" width="30" height="1.54" fill="#b22234"/><rect y="6.15" width="30" height="1.54" fill="#b22234"/><rect y="9.23" width="30" height="1.54" fill="#b22234"/><rect y="12.31" width="30" height="1.54" fill="#b22234"/><rect y="15.38" width="30" height="1.54" fill="#b22234"/><rect y="18.46" width="30" height="1.54" fill="#b22234"/><rect width="13" height="10.8" fill="#3c3b6e"/><circle cx="3" cy="2" r="0.5" fill="#fff"/><circle cx="6.5" cy="2" r="0.5" fill="#fff"/><circle cx="10" cy="2" r="0.5" fill="#fff"/><circle cx="3" cy="5" r="0.5" fill="#fff"/><circle cx="6.5" cy="5" r="0.5" fill="#fff"/><circle cx="10" cy="5" r="0.5" fill="#fff"/><circle cx="3" cy="8" r="0.5" fill="#fff"/><circle cx="6.5" cy="8" r="0.5" fill="#fff"/><circle cx="10" cy="8" r="0.5" fill="#fff"/>`,
VN:`<rect width="30" height="20" fill="#da251d"/><polygon points="15,5.5 16.2,9 20,9 17,11.2 18.1,15 15,12.7 11.9,15 13,11.2 10,9 13.8,9" fill="#ffff00"/>`,
ZA:`<rect width="30" height="20" fill="#fff"/><polygon points="0,0 30,0 30,7.5 13,10 30,12.5 30,20 0,20" fill="#007a4d"/><polygon points="0,1.7 30,0.9 30,5.6 12.5,10 30,14.4 30,19.1 0,18.3 0,14.6 17.3,10 0,5.4" fill="#fff"/><polygon points="0,3.3 30,1.7 30,6.7 15,10 30,13.3 30,18.3 0,16.7 0,13.3 20,10 0,6.7" fill="#ffb612"/><polygon points="0,4.6 30,0 30,4.6 11.5,10" fill="#de3831"/><polygon points="0,15.4 30,20 30,15.4 11.5,10" fill="#002395"/><polygon points="0,0 12,10 0,20" fill="#000"/>`,
EG:`<rect width="30" height="6.67" y="0" fill="#ce1126"/><rect width="30" height="6.67" y="6.67" fill="#fff"/><rect width="30" height="6.67" y="13.33" fill="#000"/><circle cx="15" cy="10" r="2.2" fill="#c09a3e"/>`,
JP:`<rect width="30" height="20" fill="#fff"/><circle cx="15" cy="10" r="6" fill="#bc002d"/>`,
MX:`<rect width="10" height="20" fill="#006847"/><rect width="10" height="20" x="10" fill="#fff"/><rect width="10" height="20" x="20" fill="#ce1126"/><circle cx="15" cy="10" r="2.5" fill="#8b4513"/>`,
RS:`<rect width="30" height="6.67" y="0" fill="#c6363c"/><rect width="30" height="6.67" y="6.67" fill="#0c4076"/><rect width="30" height="6.67" y="13.33" fill="#fff"/>`,
SA:`<rect width="30" height="20" fill="#006c35"/><rect x="6" y="8" width="18" height="2" fill="#fff"/><rect x="12" y="11" width="6" height="2" fill="#fff"/>`,
BG:`<rect width="30" height="6.67" y="0" fill="#fff"/><rect width="30" height="6.67" y="6.67" fill="#00966e"/><rect width="30" height="6.67" y="13.33" fill="#d62612"/>`,
IE:`<rect width="10" height="20" fill="#169b62"/><rect width="10" height="20" x="10" fill="#fff"/><rect width="10" height="20" x="20" fill="#ff883e"/>`,
KZ:`<rect width="30" height="20" fill="#00afca"/><circle cx="15" cy="9" r="3.2" fill="#ffd100"/><g fill="#ffd100"><rect x="14.4" y="0" width="1.2" height="4"/></g>`,
};

// Resolve a bandeira certa de um craque — se for o personagem do Rumo à Ascensão, usa o país
// que ele escolheu na criação; senão, usa o país real do craque como sempre.
function playerFlag(p){
  if(p.isCharacter) return countryFlag(p.country);
  return countryFlag(PLAYER_COUNTRY[p.name.toLowerCase()]);
}
function countryFlag(code){
  if(!code) return "";
  const cc = code.toUpperCase();
  const svg = FLAG_SVG[cc];
  if(svg){
    return `<svg viewBox="0 0 30 20" width="16" height="11" class="flag-img" style="vertical-align:middle;border-radius:1px;">${svg}</svg>`;
  }
  return `<span class="flag-fallback" style="display:inline-block;">${cc}</span>`;
}
