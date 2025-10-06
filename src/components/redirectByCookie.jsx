import { BrowserRouter as Router, Routes, Route, Navigate, useParams } from "react-router-dom";

export default function RedirectByCookie() {
  let lang = "es";

  if (typeof document !== "undefined") {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("preferred_language="));
    if (cookie) {
      const langFromCookie = cookie.split("=")[1];
      if (langFromCookie === "es" || langFromCookie === "en") {
        lang = langFromCookie;
      }
    }
  }

  return <Navigate to={`/${lang}`} replace />;
}