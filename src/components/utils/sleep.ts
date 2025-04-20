export default function sleep (time:number){
  return  new Promise((resolve) =>{
    setTimeout(() => resolve({sucess: true}),time)
  });
}
