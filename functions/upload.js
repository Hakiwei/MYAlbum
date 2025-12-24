export  async function onRequestPost(context){
    const { request, env }= context;

    try{
        const formData = await request.formData();

        const file = formData.get('file');

        if(!file){
            return new Response("No file uploaded",{ status: 400});
        }

        await env.ShareBucket.put(`photobucket/${file.name}` ,file);

        return new Response(`https://pub-af017771c2664a4390128eab2bdd6fee.r2.dev/photobucket/${file.name}`);

    }catch(err){
        return new Response(`Upload failed: ${err.message}`,{ status: 500});
    }
}