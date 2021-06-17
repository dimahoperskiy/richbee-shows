import './App.css';
import Search from "./search/Search";
import {Route, Switch} from "react-router";
import Info from "./info/Info";


function App() {
  return (
    <div className="App">
        <Switch>
            <Route path="/home/:name" component={Search}/>
            <Route path="/info/:id" component={Info}/>
            <Route exact path="/" component={Search}/>
        </Switch>
    </div>
  );
}

export default App;
