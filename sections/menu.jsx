import { Ourmenu } from "@/constant";
import Section from "@/components/Section";
import CoffeeCard from "@/components/CoffeeCard";
import { RunningText, TitlePage } from "@/components/TypingText";
import { useRouter } from "next/router";

const OurMenu = () => {
  const router = useRouter(); // Initialize the router

  const handleClick = (id) => {
    // Navigate to the coffee item page with the selected ID
    router.push(`/menu/${id}`);
  };
  return (
    <Section id="menu">
      <RunningText />
      <TitlePage title="Our main menus" />

      <div className="mt-[50px] flex flex-row min-h-[70vh] gap-2">
        {Ourmenu.map((coffee, index) => (
          <CoffeeCard
            key={coffee.id}
            {...coffee}
          handleClick={handleClick}
          />
        ))}
      </div>
    </Section>
  );
};

export default OurMenu;
