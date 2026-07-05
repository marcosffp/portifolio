import React, { useEffect, useState, useCallback } from "react";

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
import { Code, GitBranch, Boxes } from "lucide-react";


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

// icon = slug do https://skillicons.dev/icons?i=<slug>, ou "/arquivo.ext" pra usar um ícone local em public/.
// Pra adicionar uma tech nova, só incluir uma linha aqui.
const techStacks = [
  { icon: "spring", language: "Spring Boot" },
  { icon: "java", language: "Java" },
  { icon: "postgres", language: "PostgreSQL" },
  { icon: "nextjs", language: "Next.js" },
  { icon: "nodejs", language: "Node JS" },
  { icon: "kafka", language: "Kafka" },
  { icon: "rabbitmq", language: "RabbitMQ" },
  { icon: "go", language: "Golang" },
  { icon: "mongodb", language: "MongoDB" },
  { icon: "flutter", language: "Flutter" },
  { icon: "ts", language: "TypeScript" },
  { icon: "py", language: "Python" },
  { icon: "docker", language: "Docker" },
  { icon: "gcp", language: "Google Cloud" },
  { icon: "js", language: "JavaScript" },
  { icon: "astro", language: "Astro" },
  { icon: "github", language: "GitHub" },
  { icon: "git", language: "Git" },
  { icon: "mysql", language: "MySQL" },
  { icon: "elasticsearch", language: "Elasticsearch" },
  { icon: "/sydle.png", language: "SYDLE" },
  { icon: "/claude.svg", language: "Claude" },
  { icon: "prisma", language: "Prisma" },
  { icon: "/neo4j.webp", language: "Neo4j", needsLightBg: true },
  { icon: "vercel", language: "Vercel" },
  { icon: "firebase", language: "Firebase" },
  { icon: "/tidb.ico", language: "TiDB" },
  { icon: "redis", language: "Redis" },
  { icon: "tailwind", language: "Tailwind CSS" },
  { icon: "react", language: "React" },
  { icon: "/react-native.png", language: "React Native" },
  { icon: "/kanban.png", language: "Kanban", needsLightBg: true },
  { icon: "/bpmn.svg", language: "BPMN" },
  { icon: "/railway.webp", language: "Railway", needsLightBg: true },
  { icon: "/render.png", language: "Render" },
  { icon: "/supabase.webp", language: "Supabase" },
];

export default function FullWidthTabs() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [value, setValue] = useState(0);
  const [projects, setProjects] = useState([]);
  const [showAllProjects, setShowAllProjects] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const isMobile = window.innerWidth < 768;
  const initialItems = isMobile ? 4 : 6;

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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-5">
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
            <div className="container mx-auto flex justify-center items-center overflow-hidden pb-[5%]">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 lg:gap-8 gap-5">
                {techStacks.map((stack, index) => (
                  <div
                    key={index}
                    data-aos={index % 3 === 0 ? "fade-up-right" : index % 3 === 1 ? "fade-up" : "fade-up-left"}
                    data-aos-duration={index % 3 === 0 ? "1000" : index % 3 === 1 ? "1200" : "1000"}
                  >
                    <TechStackIcon TechStackIcon={stack.icon} Language={stack.language} needsLightBg={stack.needsLightBg} />
                  </div>
                ))}
              </div>
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