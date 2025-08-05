import { ArrowRight, Shield, Clock, Award } from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section
      className="min-h-screen relative overflow-hidden"
      aria-label="Section d'accueil - Maintenance ferroviaire"
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-oncf-dark-blue via-oncf-blue to-primary-glow opacity-90"></div>
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(https://f2.hespress.com/wp-content/uploads/2025/02/ONCFmaintenance.jpg)` }}
        
      ></div>
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-32">
        <div className="max-w-4xl mx-auto text-center text-white">
          <div className="mb-6 inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <Shield className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Excellence en Maintenance Ferroviaire</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Maintenance de{" "}
            <span className="bg-gradient-to-r from-white to-oncf-light-blue bg-clip-text text-transparent">
              Pointe
            </span>
            <br />
            pour vos Trains
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed">
            L'ONCF garantit la sécurité, la fiabilité et la performance de votre flotte ferroviaire 
            grâce à notre expertise technique de classe mondiale et nos technologies avancées.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link
              to='/form'
              type="button"
              className="text-lg px-8 py-4 bg-[#FC6A00] text-oncf-dark-blue rounded-full hover:bg-[#FC6A00]-200 transition flex items-center justify-center"
            >
              Renseignement Caténaire
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              to='/form-sous-station'
              type="button"
              className="text-lg px-8 py-4 bg-[#FC6A00] text-oncf-dark-blue rounded-full hover:bg-[#FC6A00]-200 transition flex items-center justify-center"
            >
              Renseignement Sous Station
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link 
              to='/display'
              type="button"
              className="text-lg px-8 py-4 border border-white/30 bg-white/10 text-white rounded-full hover:bg-white/20 transition"
            >
              Voir les interventions
            </Link>
          </div>

          
        </div>
      </div>

      {/* Decorative Bottom Gradient */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background to-transparent"></div>
    </section>
  );
};

export default Home;
