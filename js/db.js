        const dbPromised = idb.open("la-liga-app", 1, function(upgradeDb) {
  const teamsObjectStore = upgradeDb.createObjectStore("team", {
    keyPath: "id"
  });
  teamsObjectStore.createIndex("id", "id", { unique: false });
});

function saveFavoriteTeams(data) {
  dbPromised
    .then(function(db) {
      let tx    = db.transaction("team", "readwrite");
      let store = tx.objectStore("team");

      store.put(data);
      return tx.complete;
    })
    .then(function() {
      M.toast({html: 'Managed to save!'})
    }).catch(function() {
      M.toast({html: 'Failed to save!'})
    });
}

function getAll() {
  return new Promise(function(resolve, reject) {
    dbPromised
      .then(function(db) {
        let tx    = db.transaction("team", "readonly");
        let store = tx.objectStore("team");

        return store.getAll().catch();
      })
      .then(function(teams) {
        resolve(teams);
      });
  });
}

function getById(id) {
  return new Promise(function(resolve, reject) {
    dbPromised
      .then(function(db) {
        let tx    = db.transaction("team", "readonly");
        let store = tx.objectStore("team");

        return store.get(parseInt((id)));
      })
      .then(function(team) {
        resolve(team);
      });
  });
}

function deleteTeam(team) {
  dbPromised
  .then(function(db) {
    let tx = db.transaction("team", "readwrite");
    let store = tx.objectStore("team");
    
    store.delete(team);
    return tx.complete;
  })
  .then(function() {
    M.toast({html: 'Successfully deleted!'})
    window.location = "/";
  }).catch(function() {
    M.toast({html: 'Failed to deleted!!'})
  });
}