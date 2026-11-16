/* Lucide icons (same set used by the React app) rendered as inline SVG */
const ICONS = {
 "Activity": {
  "cls": "lucide lucide-activity",
  "inner": "<path d=\"M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2\" />"
 },
 "ArrowLeft": {
  "cls": "lucide lucide-arrow-left",
  "inner": "<path d=\"m12 19-7-7 7-7\" /><path d=\"M19 12H5\" />"
 },
 "ArrowRight": {
  "cls": "lucide lucide-arrow-right",
  "inner": "<path d=\"M5 12h14\" /><path d=\"m12 5 7 7-7 7\" />"
 },
 "BarChart3": {
  "cls": "lucide lucide-chart-column",
  "inner": "<path d=\"M3 3v16a2 2 0 0 0 2 2h16\" /><path d=\"M18 17V9\" /><path d=\"M13 17V5\" /><path d=\"M8 17v-3\" />"
 },
 "Bell": {
  "cls": "lucide lucide-bell",
  "inner": "<path d=\"M10.268 21a2 2 0 0 0 3.464 0\" /><path d=\"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326\" />"
 },
 "Bookmark": {
  "cls": "lucide lucide-bookmark",
  "inner": "<path d=\"M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z\" />"
 },
 "BookmarkCheck": {
  "cls": "lucide lucide-bookmark-check",
  "inner": "<path d=\"M17 3a2 2 0 0 1 2 2v15a1 1 0 0 1-1.496.868l-4.512-2.578a2 2 0 0 0-1.984 0l-4.512 2.578A1 1 0 0 1 5 20V5a2 2 0 0 1 2-2z\" /><path d=\"m9 10 2 2 4-4\" />"
 },
 "CalendarDays": {
  "cls": "lucide lucide-calendar-days",
  "inner": "<path d=\"M8 2v3\" /><path d=\"M16 2v3\" /><rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\" /><path d=\"M3 9h18\" /><path d=\"M8 13h.01\" /><path d=\"M12 13h.01\" /><path d=\"M16 13h.01\" /><path d=\"M8 17h.01\" /><path d=\"M12 17h.01\" /><path d=\"M16 17h.01\" />"
 },
 "Check": {
  "cls": "lucide lucide-check",
  "inner": "<path d=\"M20 6 9 17l-5-5\" />"
 },
 "CheckCircle2": {
  "cls": "lucide lucide-circle-check-big",
  "inner": "<path d=\"M21.801 10A10 10 0 1 1 17 3.335\" /><path d=\"m9 11 3 3L22 4\" />"
 },
 "ChevronDown": {
  "cls": "lucide lucide-chevron-down",
  "inner": "<path d=\"m6 9 6 6 6-6\" />"
 },
 "Clock3": {
  "cls": "lucide lucide-clock-3",
  "inner": "<circle cx=\"12\" cy=\"12\" r=\"10\" /><path d=\"M12 6v6h4\" />"
 },
 "Download": {
  "cls": "lucide lucide-download",
  "inner": "<path d=\"M12 15V3\" /><path d=\"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4\" /><path d=\"m7 10 5 5 5-5\" />"
 },
 "Eye": {
  "cls": "lucide lucide-eye",
  "inner": "<path d=\"M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0\" /><circle cx=\"12\" cy=\"12\" r=\"3\" />"
 },
 "FilePenLine": {
  "cls": "lucide lucide-file-pen-line",
  "inner": "<path d=\"M14.364 13.634a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506l4.013-4.009a1 1 0 0 0-3.004-3.004z\" /><path d=\"M14.487 7.858A1 1 0 0 1 14 7V2\" /><path d=\"M20 19.645V20a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l2.516 2.516\" /><path d=\"M8 18h1\" />"
 },
 "Filter": {
  "cls": "lucide lucide-funnel",
  "inner": "<path d=\"M10 20a1 1 0 0 0 .553.895l2 1A1 1 0 0 0 14 21v-7a2 2 0 0 1 .517-1.341L21.74 4.67A1 1 0 0 0 21 3H3a1 1 0 0 0-.742 1.67l7.225 7.989A2 2 0 0 1 10 14z\" />"
 },
 "GraduationCap": {
  "cls": "lucide lucide-graduation-cap",
  "inner": "<path d=\"M21.42 10.922a1 1 0 0 0-.019-1.838L12.83 5.18a2 2 0 0 0-1.66 0L2.6 9.08a1 1 0 0 0 0 1.832l8.57 3.908a2 2 0 0 0 1.66 0z\" /><path d=\"M22 10v6\" /><path d=\"M6 12.5V16a6 3 0 0 0 12 0v-3.5\" />"
 },
 "LayoutDashboard": {
  "cls": "lucide lucide-layout-dashboard",
  "inner": "<rect width=\"7\" height=\"9\" x=\"3\" y=\"3\" rx=\"1\" /><rect width=\"7\" height=\"5\" x=\"14\" y=\"3\" rx=\"1\" /><rect width=\"7\" height=\"9\" x=\"14\" y=\"12\" rx=\"1\" /><rect width=\"7\" height=\"5\" x=\"3\" y=\"16\" rx=\"1\" />"
 },
 "ListFilter": {
  "cls": "lucide lucide-list-filter",
  "inner": "<path d=\"M2 5h20\" /><path d=\"M6 12h12\" /><path d=\"M9 19h6\" />"
 },
 "LockKeyhole": {
  "cls": "lucide lucide-lock-keyhole",
  "inner": "<circle cx=\"12\" cy=\"16\" r=\"1\" /><rect x=\"3\" y=\"10\" width=\"18\" height=\"12\" rx=\"2\" /><path d=\"M7 10V7a5 5 0 0 1 10 0v3\" />"
 },
 "LogOut": {
  "cls": "lucide lucide-log-out",
  "inner": "<path d=\"m16 17 5-5-5-5\" /><path d=\"M21 12H9\" /><path d=\"M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4\" />"
 },
 "Mail": {
  "cls": "lucide lucide-mail",
  "inner": "<path d=\"m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7\" /><rect x=\"2\" y=\"4\" width=\"20\" height=\"16\" rx=\"2\" />"
 },
 "MapPin": {
  "cls": "lucide lucide-map-pin",
  "inner": "<path d=\"M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0\" /><circle cx=\"12\" cy=\"10\" r=\"3\" />"
 },
 "Menu": {
  "cls": "lucide lucide-menu",
  "inner": "<path d=\"M4 5h16\" /><path d=\"M4 12h16\" /><path d=\"M4 19h16\" />"
 },
 "MoreHorizontal": {
  "cls": "lucide lucide-ellipsis",
  "inner": "<circle cx=\"12\" cy=\"12\" r=\"1\" /><circle cx=\"19\" cy=\"12\" r=\"1\" /><circle cx=\"5\" cy=\"12\" r=\"1\" />"
 },
 "Plus": {
  "cls": "lucide lucide-plus",
  "inner": "<path d=\"M5 12h14\" /><path d=\"M12 5v14\" />"
 },
 "QrCode": {
  "cls": "lucide lucide-qr-code",
  "inner": "<rect width=\"5\" height=\"5\" x=\"3\" y=\"3\" rx=\"1\" /><rect width=\"5\" height=\"5\" x=\"16\" y=\"3\" rx=\"1\" /><rect width=\"5\" height=\"5\" x=\"3\" y=\"16\" rx=\"1\" /><path d=\"M21 16h-3a2 2 0 0 0-2 2v3\" /><path d=\"M21 21v.01\" /><path d=\"M12 7v3a2 2 0 0 1-2 2H7\" /><path d=\"M3 12h.01\" /><path d=\"M12 3h.01\" /><path d=\"M12 16v.01\" /><path d=\"M16 12h1\" /><path d=\"M21 12v.01\" /><path d=\"M12 21v-1\" />"
 },
 "Search": {
  "cls": "lucide lucide-search",
  "inner": "<path d=\"m21 21-4.34-4.34\" /><circle cx=\"11\" cy=\"11\" r=\"8\" />"
 },
 "Settings": {
  "cls": "lucide lucide-settings",
  "inner": "<path d=\"M9.671 4.136a2.34 2.34 0 0 1 4.659 0 2.34 2.34 0 0 0 3.319 1.915 2.34 2.34 0 0 1 2.33 4.033 2.34 2.34 0 0 0 0 3.831 2.34 2.34 0 0 1-2.33 4.033 2.34 2.34 0 0 0-3.319 1.915 2.34 2.34 0 0 1-4.659 0 2.34 2.34 0 0 0-3.32-1.915 2.34 2.34 0 0 1-2.33-4.033 2.34 2.34 0 0 0 0-3.831A2.34 2.34 0 0 1 6.35 6.051a2.34 2.34 0 0 0 3.319-1.915\" /><circle cx=\"12\" cy=\"12\" r=\"3\" />"
 },
 "ShieldCheck": {
  "cls": "lucide lucide-shield-check",
  "inner": "<path d=\"M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z\" /><path d=\"m9 12 2 2 4-4\" />"
 },
 "Sparkles": {
  "cls": "lucide lucide-sparkles",
  "inner": "<path d=\"M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z\" /><path d=\"M20 2v4\" /><path d=\"M22 4h-4\" /><circle cx=\"4\" cy=\"20\" r=\"2\" />"
 },
 "TicketCheck": {
  "cls": "lucide lucide-ticket-check",
  "inner": "<path d=\"M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z\" /><path d=\"m9 12 2 2 4-4\" />"
 },
 "Trash2": {
  "cls": "lucide lucide-trash-2",
  "inner": "<path d=\"M10 11v6\" /><path d=\"M14 11v6\" /><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6\" /><path d=\"M3 6h18\" /><path d=\"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\" />"
 },
 "UploadCloud": {
  "cls": "lucide lucide-cloud-upload",
  "inner": "<path d=\"M12 13v8\" /><path d=\"M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242\" /><path d=\"m8 17 4-4 4 4\" />"
 },
 "UserRound": {
  "cls": "lucide lucide-user-round",
  "inner": "<circle cx=\"12\" cy=\"8\" r=\"5\" /><path d=\"M20 21a8 8 0 0 0-16 0\" />"
 },
 "UsersRound": {
  "cls": "lucide lucide-users-round",
  "inner": "<path d=\"M18 21a8 8 0 0 0-16 0\" /><circle cx=\"10\" cy=\"8\" r=\"5\" /><path d=\"M22 20c0-3.37-2-6.5-4-8a5 5 0 0 0-.45-8.3\" />"
 },
 "X": {
  "cls": "lucide lucide-x",
  "inner": "<path d=\"M18 6 6 18\" /><path d=\"m6 6 12 12\" />"
 }
};

function Icon(name, { size = 24, cls = '', strokeWidth = 2, fill = 'none' } = {}) {
  const i = ICONS[name];
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="${fill}" stroke="currentColor" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" class="${i.cls}${cls ? ' ' + cls : ''}">${i.inner}</svg>`;
}
