export async function prepareJobPhoto(file:File):Promise<File> {
 if(file.size>30*1024*1024)throw Error("Deze foto is groter dan 30 MB. Kies een kleinere foto.");
 if(!file.type.startsWith("image/"))throw Error("Kies een afbeelding.");
 const url=URL.createObjectURL(file);
 try {
  const img=await new Promise<HTMLImageElement>((resolve,reject)=>{const i=new Image();i.onload=()=>resolve(i);i.onerror=()=>reject(Error("Dit fotoformaat kan niet worden geopend. Gebruik JPG, PNG of WebP; exporteer HEIC eerst als JPG."));i.src=url;});
  let edge=1920;
  for(let attempt=0;attempt<4;attempt++) {
   const scale=Math.min(1,edge/Math.max(img.naturalWidth,img.naturalHeight));const canvas=document.createElement("canvas");canvas.width=Math.max(1,Math.round(img.naturalWidth*scale));canvas.height=Math.max(1,Math.round(img.naturalHeight*scale));
   const ctx=canvas.getContext("2d");if(!ctx)throw Error("Foto verkleinen lukt niet op dit apparaat.");ctx.fillStyle="#fff";ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);
   const blob=await new Promise<Blob|null>(resolve=>canvas.toBlob(resolve,"image/jpeg",0.84));
   if(blob&&blob.size<=1048576)return new File([blob],"werkfoto.jpg",{type:"image/jpeg"});edge=Math.round(edge*0.7);
  }
  throw Error("Foto blijft te groot. Kies een kleinere afbeelding.");
 } finally {URL.revokeObjectURL(url);}
}
