export function formatDateMin(date) {
  return new Date(date).toLocaleDateString("pt-BR", { year: "numeric", month: "long", day: "numeric" });
}

export function formatDate(date) {
  return new Date(date).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatDateCallendar(date) {
  return new Date(date).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
}
export function formatTimestamp(date) {
  return new Date(date).getTime();
}

export function formatDateTime(date) {
  let d = new Date(date);

  let calendar = d.toLocaleDateString("pt-BR", {
    timeZone: "UTC",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  let time = `${d.getUTCHours()}:${d.getUTCMinutes()}:${d.getUTCSeconds()}`;

  return calendar + " - " + time;
}

export function getPrice(value, type = "full") {
  if (type == "full") return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  if (type == "real") return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }).split(",")[0];
  if (type == "cent") return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }).split(",")[1];
}

export function getDistanceFrom(position1, position2) {
  const deg2rad = (deg) => deg * (Math.PI / 180);

  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(position2.lat - position1.lat); // deg2rad below
  var dLon = deg2rad(position2.lon - position1.lon);
  var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(position1.lat)) * Math.cos(deg2rad(position2.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km

  let text = d >= 1 ? "Km de você" : " metros de você";
  if (d < 1) d = d * 1000;

  let distance = Math.round(d).toLocaleString("pt-BR");
  return distance + text;
}

export function removeNullObj(obj) {
  return (
    Object.entries(obj)
      // eslint-disable-next-line
      .filter(([_, v]) => v != null && v != "")
      .reduce((acc, [k, v]) => ({ ...acc, [k]: v }), {})
  );
}

export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function randChar(length) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}
