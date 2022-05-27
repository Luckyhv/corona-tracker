import { Card, CardContent, FormControl, MenuItem, Select } from '@material-ui/core';
import { useEffect, useState } from 'react';
import './App.css';
import Infobox from './components/Infobox';
import Graph from './components/Graph';
import Table from './components/Table'
import {sortData} from './Util'

function App() {
  // eslint-disable-next-line
  const [countries,setcountries] = useState([]);
  const [selectcountry,setselcountry] = useState("worldwide");
  const [countryinfo,setcountryinfo] = useState({});
  const [tabledata, settabledata] = useState([]);

  const getcountries=async()=>{
    const api = await fetch("https://disease.sh/v3/covid-19/countries");
    const data = await api.json();
    // console.log(data);
    const arr = data.map((item)=>(
      // console.log(item.country),
      {name :item.country,
      keyval : item.countryInfo._id}
      ))

      const sorteddata = sortData(data)
      settabledata(sorteddata);
      setcountries(arr);
  }

  useEffect(()=>{
    getcountries();
  },[])

  const oncountrychange=async(e)=>{
    const countryid = e.target.value;
    const url =countryid === "worldwide"
    ? "https://disease.sh/v3/covid-19/all"
    : `https://disease.sh/v3/covid-19/countries/${countryid}`;
    const api1 = await fetch(url) ;
    const data1 = await api1.json();
    setselcountry(countryid);
    setcountryinfo(data1);
    console.log(data1);
  }

  useEffect(()=>{
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setcountryinfo(data);
      });
  },[])

  return (
    <div className="App">
      <div className="leftcon">
      <div className='header'>
      <h1>covid-19 tracker</h1>
      <FormControl className='dropdowncon'>
        <Select variant='outlined' value={selectcountry} onChange={oncountrychange}>
        <MenuItem value="worldwide">Worldwide</MenuItem>
          {countries.map((country)=>(
            <MenuItem value={country.keyval}>{country.name}</MenuItem>
          ))}
        </Select>
      </FormControl>
      </div>
      <div className="infobox">
        <Infobox title="Covid-19 cases" cases={countryinfo.todayCases} total={countryinfo.cases} />
        <Infobox title="Recovered" cases={countryinfo.todayRecovered} total={countryinfo.recovered} />
        <Infobox title="Deaths" cases={countryinfo.todayDeaths} total={countryinfo.deaths} />
      </div>
      <div className='gr'>
      <h1>Worldwide New Cases</h1>
      <Graph/>
      </div>
      </div>
      <Card className="rightcon">
        <CardContent>
          <h3>Live Cases By Countries</h3>
          <Table countries={tabledata}/>
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
