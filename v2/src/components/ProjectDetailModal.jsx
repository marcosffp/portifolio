import { useEffect } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "../contexts/LanguageContext";
import {
  X,
  ExternalLink,
  Github,
  Code2,
  Star,
  Layout,
  Globe,
  Package,
  Cpu,
  Code,
} from "lucide-react";
import Swal from "sweetalert2";

const TECH_ICONS = {
  React: Globe,
  Tailwind: Layout,
  Express: Cpu,
  Python: Code,
  Javascript: Code,
  HTML: Code,
  CSS: Code,
  default: Package,
};

const TechBadge = ({ tech }) => {
  const Icon = TECH_ICONS[tech] || TECH_ICONS["default"];
  return (
    <div className="group relative overflow-hidden px-3 py-2 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 rounded-xl border border-blue-500/10 hover:border-blue-500/30 transition-all duration-300">
      <div className="relative flex items-center gap-1.5">
        <Icon className="w-3.5 h-3.5 text-blue-400" />
        <span className="text-xs font-medium text-blue-300/90">{tech}</span>
      </div>
    </div>
  );
};
TechBadge.propTypes = { tech: PropTypes.string.isRequired };

const FeatureItem = ({ feature }) => (
  <li className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors">
    <div className="mt-2 w-1.5 h-1.5 shrink-0 rounded-full bg-gradient-to-r from-blue-400 to-cyan-400" />
    <span className="text-sm text-gray-300">{feature}</span>
  </li>
);
FeatureItem.propTypes = { feature: PropTypes.string.isRequired };

export default function ProjectDetailModal({ project, onClose }) {
  const { t, language } = useTranslation();
  const tp = t.projectDetail;

  useEffect(() => {
    const onKeyDown = (e) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleGithubClick = (e, githubLink) => {
    if (githubLink === "Private") {
      e.preventDefault();
      Swal.fire({
        icon: "info",
        title: tp.privateTitle,
        text: tp.privateText,
        confirmButtonText: tp.understand,
        confirmButtonColor: "#3085d6",
        background: "var(--color-canvas)",
        color: "#ffffff",
      });
    }
  };

  const techStack = project.TechStack || [];
  const features =
    language === "en" && project.Features_en?.length > 0
      ? project.Features_en
      : project.Features || [];
  const github = project.Github || "https://github.com/marcosffp";
  const displayTitle =
    language === "en" && project.Title_en ? project.Title_en : project.Title;
  const displayDescription =
    language === "en" && project.Description_en
      ? project.Description_en
      : project.Description;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className="relative z-10 w-full max-w-5xl flex flex-col"
        style={{ maxHeight: "calc(100vh - 24px)" }}
      >
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-2xl blur opacity-20 pointer-events-none" />
        <div
          className="relative bg-white/10 backdrop-blur-2xl border border-white/20 rounded-2xl overflow-hidden flex flex-col shadow-2xl"
          style={{ maxHeight: "calc(100vh - 24px)" }}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="overflow-y-auto p-5 sm:p-8 space-y-6 lg:space-y-8">
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-200 via-sky-200 to-cyan-200 bg-clip-text text-transparent leading-tight pr-10">
              {displayTitle}
            </h1>

            {project.Video ? (
              <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-video bg-black">
                <video
                  src={project.Video}
                  poster={project.Img || undefined}
                  className="w-full h-full object-contain"
                  autoPlay
                  loop
                  muted
                  playsInline
                  controls
                />
              </div>
            ) : (
              project.Img && (
                <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-video bg-black">
                  <img
                    src={project.Img}
                    alt={displayTitle}
                    className="w-full h-full object-contain"
                  />
                </div>
              )
            )}

            <div className="grid lg:grid-cols-2 gap-6 lg:gap-10">
              <div className="space-y-5">
                <p className="text-sm sm:text-base text-gray-300/90 leading-relaxed">
                  {displayDescription}
                </p>

                <div className="flex flex-wrap gap-3">
                  {project.Link ? (
                    <a
                      href={project.Link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 hover:from-blue-600/20 hover:to-cyan-600/20 text-blue-300 rounded-xl border border-blue-500/20 hover:border-blue-500/40 text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span className="font-medium">Live Demo</span>
                    </a>
                  ) : null}
                  <a
                    href={github}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => handleGithubClick(e, github)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-sky-600/10 to-blue-600/10 hover:from-sky-600/20 hover:to-blue-600/20 text-sky-300 rounded-xl border border-sky-500/20 hover:border-sky-500/40 text-sm"
                  >
                    <Github className="w-4 h-4" />
                    <span className="font-medium">Github</span>
                  </a>
                </div>

                <div className="space-y-3">
                  <h3 className="text-base font-semibold text-white/90 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-blue-400" />
                    {tp.technologiesUsed}
                  </h3>
                  {techStack.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {techStack.map((tech, index) => (
                        <TechBadge key={index} tech={tech} />
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-400 opacity-50">
                      {tp.noTech}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-white/5 rounded-2xl p-5 border border-white/10 space-y-4">
                <h3 className="text-base font-semibold text-white/90 flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  {tp.keyFeatures}
                </h3>
                {features.length > 0 ? (
                  <ul className="list-none space-y-1.5">
                    {features.map((feature, index) => (
                      <FeatureItem key={index} feature={feature} />
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-400 opacity-50">
                    {tp.noFeatures}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ProjectDetailModal.propTypes = {
  project: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};
