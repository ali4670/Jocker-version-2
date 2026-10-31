import Delivery from '../components/Delivery.jsx';
import Hero from '../components/Hero.jsx';
import JokerShowcase from '../components/JokerShowcase.jsx';
import Manifesto from '../components/Manifesto.jsx';
import Puzzle from '../components/Puzzle.jsx';
import ShopTeaser from '../components/ShopTeaser.jsx';

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <JokerShowcase />
      <ShopTeaser />
      <Puzzle />
      <Delivery />
    </>
  );
}
