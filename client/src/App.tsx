import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import ErrorDetail from "@/pages/ErrorDetail";
import { useAppContext } from "./lib/context";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/error/:code" component={ErrorDetail} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const { language } = useAppContext();
  
  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${language === 'en' ? 'font-sans' : ''}`}>
      <Router />
      <Toaster />
    </div>
  );
}

export default App;
