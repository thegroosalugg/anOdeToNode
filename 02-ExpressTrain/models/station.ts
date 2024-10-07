const stations: Station[] = [];

class Station {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  save() {
    stations.push(this);
  }

  // static allows function to be called on the Model itself, rathen than an object instance
  static fetchAll() {
    return stations;
  }
}

export default Station;
