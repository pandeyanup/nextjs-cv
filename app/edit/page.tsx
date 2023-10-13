import AboutTab from "@/components/edit/AboutTab";
import EducationTab from "@/components/edit/EducationTab";
import ExperienceTab from "@/components/edit/ExperienceTab";
import ProjectTab from "@/components/edit/ProjectTab";
import SkillTab from "@/components/edit/SkillTab";
import SocialTab from "@/components/edit/SocialTab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Page = () => {
  return (
    <div className="flex justify-center">
      <Tabs defaultValue="about" className="w-[90%]">
        <TabsList className="grid w-full sm:grid-cols-6 grid-cols-3 h-auto">
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="social">Social</TabsTrigger>
          <TabsTrigger value="skill">Skill</TabsTrigger>
          <TabsTrigger value="project">Project</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
        </TabsList>
        <TabsContent value="about">
          <AboutTab />
        </TabsContent>
        <TabsContent value="social">
          <SocialTab />
        </TabsContent>
        <TabsContent value="skill">
          <SkillTab />
        </TabsContent>
        <TabsContent value="project">
          <ProjectTab />
        </TabsContent>
        <TabsContent value="experience">
          <ExperienceTab />
        </TabsContent>
        <TabsContent value="education">
          <EducationTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Page;
