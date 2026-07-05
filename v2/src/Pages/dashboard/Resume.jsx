import { useEffect, useState } from "react";
import { supabase } from "../../supabase";
import { FileText, ExternalLink, CheckCircle2 } from "lucide-react";
import { useTranslation } from "../../contexts/LanguageContext";

const DIACRITICS_RE = new RegExp("[̀-ͯ]", "g");
const sanitizeFileName = (name) =>
  name
    .normalize("NFD").replace(DIACRITICS_RE, "")
    .replace(/[^a-zA-Z0-9.\-_]/g, "_");

const Card = ({ children, className = "" }) => (
  <div className={`relative group ${className}`}>
    <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-10 group-hover:opacity-25 transition duration-500" />
    <div className="relative bg-white/5 backdrop-blur-xl border border-white/12 rounded-2xl h-full">
      {children}
    </div>
  </div>
);

export default function Resume() {
  const { t } = useTranslation();
  const td = t.dashboard;
  const [cvUrl, setCvUrl] = useState(null);
  const [updatedAt, setUpdatedAt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const fetchSettings = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("settings")
      .select("cv_url, updated_at")
      .eq("id", 1)
      .maybeSingle();
    setCvUrl(data?.cv_url || null);
    setUpdatedAt(data?.updated_at || null);
    setLoading(false);
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const fileName = `${Date.now()}-${sanitizeFileName(file.name)}`;
      const { error: uploadError } = await supabase.storage
        .from("resume")
        .upload(fileName, file);
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from("resume").getPublicUrl(fileName);
      const { error } = await supabase.from("settings").upsert({
        id: 1,
        cv_url: data.publicUrl,
        updated_at: new Date().toISOString(),
      });
      if (error) throw error;
      await fetchSettings();
    } catch (err) {
      alert(err.message || "Erro ao enviar o currículo");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-xl blur opacity-50" />
          <div className="relative w-9 h-9 bg-canvas rounded-xl border border-white/15 flex items-center justify-center">
            <FileText className="w-4 h-4 text-indigo-400" />
          </div>
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white">{td.resume}</h1>
          <p className="text-gray-500 text-xs">
            {loading ? td.loading : cvUrl ? td.resumeUploaded : td.noResume}
          </p>
        </div>
      </div>

      <Card>
        <div className="p-5 sm:p-6 space-y-5">
          {cvUrl && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-200">{td.currentResume}</p>
                {updatedAt && (
                  <p className="text-xs text-gray-500">
                    {td.updatedAt} {new Date(updatedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              <a
                href={cvUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-white/10 text-gray-300 hover:text-white hover:border-white/20 text-xs shrink-0 transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                {td.viewFile}
              </a>
            </div>
          )}

          <label className="flex items-center gap-4 w-full bg-[#0d0d22] border border-dashed border-white/15 rounded-xl px-4 py-4 cursor-pointer hover:border-indigo-500/40 hover:bg-white/4 transition-all">
            <div className="w-24 h-16 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 shrink-0">
              <FileText className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm text-gray-300">
                {uploading ? td.saving : cvUrl ? td.changeResume : td.uploadResume}
              </p>
              <p className="text-xs text-gray-600 mt-0.5">{td.resumeFormats}</p>
            </div>
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              disabled={uploading}
              className="hidden"
            />
          </label>
        </div>
      </Card>
    </div>
  );
}
