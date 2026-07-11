import React, { useEffect, useState, useCallback, useMemo } from "react";

import { supabase } from "../supabase";
import { useTranslation } from "../contexts/LanguageContext";

import PropTypes from "prop-types";
import SwipeableViews from "react-swipeable-views";
import { useTheme } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CardProject from "../components/CardProject";
import ProjectDetailModal from "../components/ProjectDetailModal";
import TechStackIcon from "../components/TechStackIcon";
import AOS from "aos";
import "aos/dist/aos.css";
import TrajectoryTimeline from "../components/TrajectoryTimeline";
import { Code, GitBranch, Boxes, Search, X } from "lucide-react";


const ToggleButton = ({ onClick, isShowingMore, labelMore, labelLess }) => (
  <button
    onClick={onClick}
    className="
      px-3 py-1.5
      text-slate-300
      hover:text-white
      text-sm
      font-medium
      transition-all
      duration-300
      ease-in-out
      flex
      items-center
      gap-2
      bg-white/5
      hover:bg-white/10
      rounded-md
      border
      border-white/10
      hover:border-white/20
      backdrop-blur-sm
      group
      relative
      overflow-hidden
    "
  >
    <span className="relative z-10 flex items-center gap-2">
      {isShowingMore ? labelLess : labelMore}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={`
          transition-transform
          duration-300
          ${isShowingMore ? "group-hover:-translate-y-0.5" : "group-hover:translate-y-0.5"}
        `}
      >
        <polyline points={isShowingMore ? "18 15 12 9 6 15" : "6 9 12 15 18 9"}></polyline>
      </svg>
    </span>
    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary/50 transition-all duration-300 group-hover:w-full"></span>
  </button>
);


function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: { xs: 1, sm: 3 } }}>
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

// icon = slug do https://skillicons.dev/icons?i=<slug>, URL completa (ex: cdn.simpleicons.org)
// ou "/arquivo.ext" pra usar um ícone local em public/.
// categories = lista de chaves usadas pelos filtros da aba Tech Stack (ver techCategories em
// translations/index.js). Uma tech pode pertencer a mais de uma categoria.
// Pra adicionar uma tech nova, só incluir uma linha aqui.
const techStacks = [
  { icon: "spring", language: "Spring Boot", categories: ["backend"] },
  { icon: "java", language: "Java", categories: ["languages"] },
  { icon: "postgres", language: "PostgreSQL", categories: ["database"] },
  { icon: "nextjs", language: "Next.js", categories: ["frontend"] },
  { icon: "nodejs", language: "Node JS", categories: ["backend"] },
  { icon: "kafka", language: "Kafka", categories: ["devops"] },
  { icon: "rabbitmq", language: "RabbitMQ", categories: ["devops"] },
  { icon: "go", language: "Golang", categories: ["languages", "backend"] },
  { icon: "mongodb", language: "MongoDB", categories: ["database"] },
  { icon: "flutter", language: "Flutter", categories: ["mobile"] },
  { icon: "ts", language: "TypeScript", categories: ["languages"] },
  { icon: "py", language: "Python", categories: ["languages"] },
  { icon: "docker", language: "Docker", categories: ["devops"] },
  { icon: "gcp", language: "Google Cloud", categories: ["devops"] },
  { icon: "js", language: "JavaScript", categories: ["languages"] },
  { icon: "astro", language: "Astro", categories: ["frontend"] },
  { icon: "github", language: "GitHub", categories: ["tools"] },
  { icon: "git", language: "Git", categories: ["tools"] },
  { icon: "mysql", language: "MySQL", categories: ["database"] },
  { icon: "elasticsearch", language: "Elasticsearch", categories: ["devops"] },
  { icon: "/sydle.png", language: "SYDLE", categories: ["tools"] },
  { icon: "/claude.svg", language: "Claude", categories: ["tools"] },
  { icon: "prisma", language: "Prisma", categories: ["database"] },
  { icon: "/neo4j.webp", language: "Neo4j", categories: ["database"], needsLightBg: true },
  { icon: "vercel", language: "Vercel", categories: ["devops"] },
  { icon: "firebase", language: "Firebase", categories: ["backend", "devops"] },
  { icon: "/tidb.ico", language: "TiDB", categories: ["database"] },
  { icon: "redis", language: "Redis", categories: ["devops"] },
  { icon: "tailwind", language: "Tailwind CSS", categories: ["frontend"] },
  { icon: "react", language: "React", categories: ["frontend"] },
  { icon: "/react-native.png", language: "React Native", categories: ["mobile"] },
  { icon: "/kanban.png", language: "Kanban", categories: ["tools"], needsLightBg: true },
  { icon: "/bpmn.svg", language: "BPMN", categories: ["tools"] },
  { icon: "/railway.webp", language: "Railway", categories: ["devops"], needsLightBg: true },
  { icon: "/render.png", language: "Render", categories: ["devops"] },
  { icon: "/supabase.webp", language: "Supabase", categories: ["backend", "devops"] },
  { icon: "figma", language: "Figma", categories: ["tools"] },
  { icon: "https://cdn.simpleicons.org/diagramsdotnet", language: "Draw.io", categories: ["tools"] },
  { icon: "https://cdn.simpleicons.org/dbeaver", language: "DBeaver", categories: ["tools"], needsLightBg: true },
  { icon: "replit", language: "Replit", categories: ["tools"] },
  { icon: "c", language: "C", categories: ["languages"] },
  { icon: "rust", language: "Rust", categories: ["languages", "backend"] },
  { icon: "dart", language: "Dart", categories: ["languages"] },
  { icon: "vite", language: "Vite", categories: ["frontend"] },
  { icon: "jest", language: "Jest", categories: ["testing"] },
  { icon: "https://cdn.simpleicons.org/k6", language: "k6", categories: ["testing"] },
  { icon: "linux", language: "Linux", categories: ["devops"] },
  { icon: "gradle", language: "Gradle", categories: ["devops"] },
  { icon: "maven", language: "Maven", categories: ["devops"] },
  { icon: "prometheus", language: "Prometheus", categories: ["devops"] },
];

export default function FullWidthTabs() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [value, setValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [techSearch, setTechSearch] = useState("");
  const [techCategory, setTechCategory] = useState("all");
  const isMobile = window.innerWidth < 768;
  const initialItems = isMobile ? 4 : 9;

  const techCategoryTabs = useMemo(() => {
    const counts = techStacks.reduce((acc, stack) => {
      stack.categories.forEach((category) => {
        acc[category] = (acc[category] || 0) + 1;
      });
      return acc;
    }, {});
    return Object.keys(t.portfolio.techCategories).map((key) => ({
      value: key,
      label: t.portfolio.techCategories[key],
      count: key === "all" ? techStacks.length : counts[key] || 0,
    }));
  }, [t]);

  const filteredTechStacks = useMemo(() => {
    const query = techSearch.trim().toLowerCase();
    return techStacks.filter((stack) => {
      const matchesCategory = techCategory === "all" || stack.categories.includes(techCategory);
      const matchesSearch = !query || stack.language.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [techSearch, techCategory]);

  useEffect(() => {
    AOS.init({
      once: false,
    });
  }, []);


  const fetchData = useCallback(async () => {
    try {
      // As colunas reais na tabela "projects" estão em minúsculo/snake_case (ex: title, tech_stack),
      // exceto as colunas _en que foram criadas com maiúscula (Title_en, Description_en, Features_en).
      // Os aliases abaixo mapeiam pra PascalCase, que é o formato usado no resto do front-end.
      const { data, error } = await supabase
        .from("projects")
        .select("id,created_at,Title:title,Title_en,Description:description,Description_en,Img:img,Video:video,TechStack:tech_stack,Features:features,Features_en,Link:link,Github:github,OrderIndex:order_index")
        .order('order_index', { ascending: true, nullsFirst: false })
        .order('created_at', { ascending: false });
      if (error) throw error;
      const projectData = data || [];
      setProjects(projectData);
      localStorage.setItem("projects", JSON.stringify(projectData));
    } catch (error) {
      console.error("Error fetching data from Supabase:", error.message);
    }
  }, []);



  useEffect(() => {
    const cachedProjects = localStorage.getItem('projects');
    if (cachedProjects) {
      setProjects(JSON.parse(cachedProjects));
    }
    fetchData();
  }, [fetchData]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const toggleShowMore = useCallback(() => {
    setShowAllProjects(prev => !prev);
  }, []);

  const displayedProjects = showAllProjects ? projects : projects.slice(0, initialItems);

  // Sisa dari komponen (return statement) tidak ada perubahan
  return (
    <div className="md:px-[10%] px-[5%] w-full sm:mt-0 mt-[3rem] bg-canvas overflow-hidden" id="Portofolio">
      {/* Header section */}
      <div className="text-center pb-10" data-aos="fade-up" data-aos-duration="1000">
        <h2 className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
          {t.portfolio.title}
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2">
          {t.portfolio.subtitle}
        </p>
      </div>

      <Box sx={{ width: "100%" }}>
        {/* AppBar and Tabs section - unchanged */}
        <AppBar
          position="static"
          elevation={0}
          sx={{
            bgcolor: "transparent",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "20px",
            position: "relative",
            overflow: "hidden",
            "&::before": {
              content: '""',
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: "linear-gradient(180deg, rgba(139, 92, 246, 0.03) 0%, rgba(59, 130, 246, 0.03) 100%)",
              backdropFilter: "blur(10px)",
              zIndex: 0,
            },
          }}
          className="md:px-4"
        >
          {/* Tabs remain unchanged */}
          <Tabs
            value={value}
            onChange={handleChange}
            textColor="secondary"
            indicatorColor="secondary"
            variant="fullWidth"
            sx={{
              minHeight: "70px",
              "& .MuiTab-root": {
                fontSize: { xs: "0.9rem", md: "1rem" },
                fontWeight: "600",
                color: "#94a3b8",
                textTransform: "none",
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                padding: "20px 0",
                zIndex: 1,
                margin: "8px",
                borderRadius: "12px",
                "&:hover": {
                  color: "#ffffff",
                  backgroundColor: "rgba(59, 130, 246, 0.1)",
                  transform: "translateY(-2px)",
                  "& .lucide": {
                    transform: "scale(1.1) rotate(5deg)",
                  },
                },
                "&.Mui-selected": {
                  color: "#fff",
                  background: "linear-gradient(135deg, rgba(29, 78, 216, 0.2), rgba(59, 130, 246, 0.2))",
                  boxShadow: "0 4px 15px -3px rgba(59, 130, 246, 0.2)",
                  "& .lucide": {
                    color: "#60a5fa",
                  },
                },
              },
              "& .MuiTabs-indicator": {
                height: 0,
              },
              "& .MuiTabs-flexContainer": {
                gap: "8px",
              },
            }}
          >
            <Tab
              icon={<Code className="mb-2 w-5 h-5 transition-all duration-300" />}
              label={t.portfolio.projects}
              {...a11yProps(0)}
            />
            <Tab
              icon={<GitBranch className="mb-2 w-5 h-5 transition-all duration-300" />}
              label={t.portfolio.trajectory}
              {...a11yProps(1)}
            />
            <Tab
              icon={<Boxes className="mb-2 w-5 h-5 transition-all duration-300" />}
              label={t.portfolio.techStack}
              {...a11yProps(2)}
            />
          </Tabs>
        </AppBar>

        <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={setValue}
        >
          <TabPanel value={value} index={0} dir={theme.direction}>
            <div className="container mx-auto flex justify-center items-center overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {displayedProjects.map((project, index) => (
                  <div
                    key={project.id || index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <CardProject
                      Img={project.Img}
                      Video={project.Video}
                      Title={project.Title}
                      Title_en={project.Title_en}
                      Description={project.Description}
                      Description_en={project.Description_en}
                      Link={project.Link}
                      TechStack={project.TechStack}
                      Features={project.Features}
                      Features_en={project.Features_en}
                      Github={project.Github}
                      id={project.id}
                      onDetails={setSelectedProject}
                    />
                  </div>
                ))}
              </div>
            </div>
            {projects.length > initialItems && (
              <div className="mt-6 w-full flex justify-start">
                <ToggleButton
                  onClick={() => toggleShowMore('projects')}
                  isShowingMore={showAllProjects}
                  labelMore={t.portfolio.seeMore}
                  labelLess={t.portfolio.seeLess}
                />
              </div>
            )}
          </TabPanel>

          <TabPanel value={value} index={1} dir={theme.direction}>
            <TrajectoryTimeline />
          </TabPanel>

          <TabPanel value={value} index={2} dir={theme.direction}>
            <div className="container mx-auto pb-[5%]">
              <div className="flex flex-col gap-4 mb-8">
                <div className="relative w-full sm:max-w-sm">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  <input
                    type="text"
                    value={techSearch}
                    onChange={(e) => setTechSearch(e.target.value)}
                    placeholder={t.portfolio.techSearchPlaceholder}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-gray-200 placeholder-gray-600 text-sm outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/20 transition-all"
                  />
                  {techSearch && (
                    <button
                      onClick={() => setTechSearch("")}
                      aria-label="clear"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-thin">
                  {techCategoryTabs.map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => setTechCategory(tab.value)}
                      className={`flex items-center gap-1.5 shrink-0 px-3 sm:px-4 py-1.5 rounded-lg text-xs sm:text-sm transition-all duration-200 border ${
                        techCategory === tab.value
                          ? "bg-gradient-to-r from-indigo-500/25 to-purple-500/20 border-indigo-500/35 text-white font-medium"
                          : "bg-white/5 border-white/10 text-gray-400 hover:text-gray-200 hover:border-white/20"
                      }`}
                    >
                      {tab.label}
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                          techCategory === tab.value ? "bg-white/15 text-white" : "bg-white/10 text-gray-500"
                        }`}
                      >
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {filteredTechStacks.length > 0 ? (
                <div className="flex justify-center items-center overflow-hidden">
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-8 gap-5">
                    {filteredTechStacks.map((stack) => (
                      <div
                        key={stack.language}
                        data-aos="fade-up"
                        data-aos-duration="800"
                      >
                        <TechStackIcon TechStackIcon={stack.icon} Language={stack.language} needsLightBg={stack.needsLightBg} />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center text-gray-500 text-sm py-12">
                  {t.portfolio.techNoResults}
                </div>
              )}
            </div>
          </TabPanel>
        </SwipeableViews>
      </Box>
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </div>
  );
}