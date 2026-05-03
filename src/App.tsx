import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const GOOGLE_FORM_URL = "https://forms.gle/m2Tc2YKkgXqkF9tr9";
const DOWNLOAD_FILE_URL = "/files/Daimond Chart.xlsm";

export default function App() {
  const submittedFromForm = useMemo(
    () => new URLSearchParams(window.location.search).get("submitted") === "1",
    []
  );

  const returnUrl = useMemo(
    () => `${window.location.origin}${window.location.pathname}?submitted=1`,
    []
  );

  const [hasPaid, setHasPaid] = useState(submittedFromForm);
  const [showDownload, setShowDownload] = useState(submittedFromForm);

  useEffect(() => {
    if (!submittedFromForm) {
      return;
    }

    setShowDownload(true);

    // Auto-trigger file download after the user returns from the form.
    const timer = window.setTimeout(() => {
      const link = document.createElement("a");
      link.href = DOWNLOAD_FILE_URL;
      link.download = "download-package.txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 700);

    return () => window.clearTimeout(timer);
  }, [submittedFromForm]);

  const openPaymentForm = () => {
    window.location.assign(GOOGLE_FORM_URL);
  };

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100 md:px-12">
      <section className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-6xl flex-col items-center justify-center gap-10 md:flex-row md:gap-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-xl space-y-5"
        >
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-cyan-300">PayDesk</p>
          <h1 className="text-4xl font-semibold leading-tight md:text-5xl">Scan QR, complete payment, then submit your payment info.</h1>
          <p className="max-w-lg text-base text-slate-300 md:text-lg">
            Click <strong>I have paid</strong>, then continue with <strong>Payment Info</strong> to open your Google Form.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setHasPaid(true)}
              className="rounded-md bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              I have paid
            </button>

            <AnimatePresence>
              {hasPaid && (
                <motion.button
                  type="button"
                  onClick={openPaymentForm}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="rounded-md border border-slate-600 px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-slate-300"
                >
                  Payment Info
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {showDownload && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 12 }}
                className="pt-2"
              >
                <a
                  href={DOWNLOAD_FILE_URL}
                  download
                  className="inline-block rounded-md bg-emerald-400 px-5 py-3 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-300"
                >
                  Download Your File
                </a>
              </motion.div>
            )}
          </AnimatePresence>

          <p className="max-w-lg text-xs leading-relaxed text-slate-400">
            Google Forms cannot auto-redirect after submit. To enable the automatic download in this page, put this URL in your Google Form confirmation message:
            <span className="mt-1 block break-all text-slate-200">{returnUrl}</span>
          </p>
        </motion.div>

        <motion.figure
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full max-w-sm"
        >
          <img
            src="/QR.png"
            alt="Payment QR code"
            className="aspect-square w-full rounded-xl bg-white object-cover p-3"
          />
        </motion.figure>
      </section>
    </main>
  );
}
