import { HeroLogoIntro } from "./components/HeroLogoIntro";
import { Section } from "./components/Section";
import { PhotographySection } from "./components/PhotographySection";
import { VideoEditingSection } from "./components/VideoEditingSection";
import { ContentProductionSection } from "./components/ContentProductionSection";
import { DigitalMarketingSection } from "./components/DigitalMarketingSection";
import { WebDevelopmentSection } from "./components/WebDevelopmentSection";
import { AppDevelopmentSection } from "./components/AppDevelopmentSection";
import { StudioSection } from "./components/StudioSection";
import { ContactSection } from "./components/ContactSection";
import { Footer } from "./components/Footer";

export function App() {
  return (
    <>
      <HeroLogoIntro />
      <Section
        id="photography"
        heading="Photography"
        subheading="Service"
        variant="default"
        className="section--intro-target"
      >
        <PhotographySection />
      </Section>
      <Section
        id="video-editing"
        heading="Video Editing"
        subheading="Service"
        variant="dark"
      >
        <VideoEditingSection />
      </Section>
      <Section
        id="content-production"
        heading="Content Production"
        subheading="Service"
        variant="default"
      >
        <ContentProductionSection />
      </Section>
      <Section
        id="digital-marketing"
        heading="Digital Marketing"
        subheading="Service"
        variant="dark"
      >
        <DigitalMarketingSection />
      </Section>
      <Section
        id="web-development"
        heading="Web Development"
        subheading="Service"
        variant="default"
      >
        <WebDevelopmentSection />
      </Section>
      <Section
        id="app-development"
        heading="App Development"
        subheading="Service"
        variant="dark"
      >
        <AppDevelopmentSection />
      </Section>
      <Section
        id="studio"
        heading="The Studio"
        subheading="About"
        variant="default"
      >
        <StudioSection />
      </Section>
      <Section
        id="contact"
        heading="Let's Talk"
        subheading="Contact"
        variant="alt"
      >
        <ContactSection />
      </Section>
      <Footer />
    </>
  );
}
