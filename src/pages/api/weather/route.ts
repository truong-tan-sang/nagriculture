export async function GET() {
    const url =
        "https://power.larc.nasa.gov/api/temporal/daily/point?parameters=T2M,PRECTOT&community=AG&longitude=105.8542&latitude=21.0285&format=JSON";

    const res = await fetch(url);
    const data = await res.json();
    // return "Hello from Nasa API";
    return Response.json(data);
}