export default async function handler(req,res){

  const { type } = req.query;

  const url = type==="departures"
    ? "https://fids.liegeairport.com/api/departures"
    : "https://fids.liegeairport.com/api/arrivals";

  try{
    const response = await fetch(url);
    const data = await response.json();
    res.status(200).json(data);
  }catch(err){
    res.status(500).json({error:"FIDS fetch failed"});
  }
}
