/* ============================================================================
   posthog-init-vlp.js
   ---------------------------------------------------------------------------
   Client-side PostHog initialization for VirtualLaunch Pro (VLP).

   Loaded via SuiteDash Script Manager under the Analytics consent category,
   so this script only executes after a visitor accepts analytics cookies
   via the GDPR banner.

   Sends events into PostHog project 387961 (Default project), tagged with
   platform: "vlp" as a super-property so VLP and TPP events are
   distinguishable in shared dashboards.

   Features enabled:
     - autocapture (clicks, form submissions, change events)
     - pageviews + pageleaves
     - session recording (network capture off by default)
     - $exception capture (uncaught errors)

   Owner: JLW
   Last updated: 2026-06-18
   ============================================================================ */

(function () {
  // Idempotency guard — Script Manager may register this on multiple pages,
  // but PostHog only needs to initialize once per page load.
  if (window.__lentaxPosthogInitialized) return;
  window.__lentaxPosthogInitialized = true;

  // Standard PostHog snippet loader (from posthog.com/docs/libraries/js).
  !function (t, e) {
    var o, n, p, r;
    e.__SV || (window.posthog = e, e._i = [], e.init = function (i, s, a) {
      function g(t, e) {
        var o = e.split(".");
        2 == o.length && (t = t[o[0]], e = o[1]);
        t[e] = function () {
          t.push([e].concat(Array.prototype.slice.call(arguments, 0)));
        };
      }
      (p = t.createElement("script")).type = "text/javascript",
      p.crossOrigin = "anonymous",
      p.async = !0,
      p.src = s.api_host.replace(".i.posthog.com", "-assets.i.posthog.com") + "/static/array.js",
      (r = t.getElementsByTagName("script")[0]).parentNode.insertBefore(p, r);
      var u = e;
      for (void 0 !== a ? u = e[a] = [] : a = "posthog", u.people = u.people || [], u.toString = function (t) {
        var e = "posthog";
        return "posthog" !== a && (e += "." + a), t || (e += " (stub)"), e;
      }, u.people.toString = function () {
        return u.toString(1) + ".people (stub)";
      }, o = "init me ws ys ps bs capture je Di ks register register_once register_for_session unregister unregister_for_session Ps getFeatureFlag getFeatureFlagPayload isFeatureEnabled reloadFeatureFlags updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures on onFeatureFlags onSessionId getSurveys getActiveMatchingSurveys renderSurvey canRenderSurvey getNextSurveyStep identify setPersonProperties group resetGroups setPersonPropertiesForFlags resetPersonPropertiesForFlags setGroupPropertiesForFlags resetGroupPropertiesForFlags reset get_distinct_id getGroups get_session_id get_session_replay_url alias set_config startSessionRecording stopSessionRecording sessionRecordingStarted captureException loadToolbar get_property getSessionProperty Es $s createPersonProfile Is opt_in_capturing opt_out_capturing has_opted_in_capturing has_opted_out_capturing clear_opt_in_out_capturing Ss debug xs getPageViewId captureTraceFeedback captureTraceMetric".split(" "), n = 0; n < o.length; n++) g(u, o[n]);
      e._i.push([i, s, a]);
    }, e.__SV = 1);
  }(document, window.posthog || []);

  // Initialize PostHog with VLP-specific config.
  window.posthog.init("phc_o5nTrNkxc37W2G9PXFL8peXMjWzdjo5d2HSjE5XzggkY", {
    api_host: "https://us.i.posthog.com",
    person_profiles: "identified_only",
    autocapture: true,
    capture_pageview: true,
    capture_pageleave: true,
    disable_session_recording: false,
    session_recording: {
      maskAllInputs: true,
      maskInputOptions: {
        password: true,
        email: false
      }
    },
    capture_exceptions: true,
    loaded: function (ph) {
      // Tag every event with platform so VLP and TPP are filterable.
      ph.register({
        platform: "vlp-app",
        platform_host: window.location.hostname
      });
    }
  });
})();
