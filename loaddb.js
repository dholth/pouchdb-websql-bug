/*global PouchDB, Promise, document, console */
/*
 * Populate PouchDB with a few directly fetched test documents.
 *
 * This is the last file of one database dump, and all the files from a second
 * database dump. IndexedDB winds up with the correct number of documents.
 * Chrome WebSQL winds up with too many. Hopefully this WebSQL bug is related
 * to the real problem we are having.
 */

 var batches = [[
 "dump2_00000020.txt",
 "dump3_00000000.txt",
 "dump3_00000001.txt",
 "dump3_00000002.txt",
 "dump3_00000003.txt",
 "dump3_00000004.txt",
 "dump3_00000005.txt",
 "dump3_00000006.txt",
 "dump3_00000007.txt",
 "dump3_00000008.txt",
 "dump3_00000009.txt",
 "dump3_00000010.txt",
 "dump3_00000011.txt",
 "dump3_00000012.txt",
 "dump3_00000013.txt",
 "dump3_00000014.txt",
 "dump3_00000015.txt",
 "dump3_00000016.txt",
 "dump3_00000017.txt",
 "dump3_00000018.txt",
 "dump3_00000019.txt",
 "dump3_00000020.txt"
]];


var db1, db2;

function showInfo(db) {
  db.info().then(function(info) {
      $('#info').append("<p id='done'>Have " + info.doc_count + " documents in " + db._name + "</p>");
  });
}

function compareDatabases(db1, db2) {
  function rowsToSet(result) {
    return new Set(result.rows.map(function(doc) {return doc.id;}));
  }

  return Promise.all([db1.allDocs().then(rowsToSet), db2.allDocs().then(rowsToSet)])
    .then(function(maps) {
      var diff = new Set();
      for(var key of maps[0]) {
        if(!maps[1].has(key)) { diff.add(key); }
      }
      return diff;
    }).then(function(diff) {
      console.log(diff);
      return diff;
    });
}

$(document).ready(function() {
  db1 = new PouchDB("loadalot-websql", {adapter:'websql'});
  db2 = new PouchDB("loadalot-idb", {adapter:'idb'});
  showInfo(db1);
  showInfo(db2);
});

function loadMinimum(db) {
  $.ajax('websql-bug.json').then(function (docs) {
    docs.forEach(function(doc) {
      db.bulkDocs(doc, {new_edits: false});
    });
  });
}

function load(batch, db) {
  Promise.all(batch.map(function (dumpFile) {
    return db.load('./' + dumpFile);
  })).then(function() { showInfo(db); });
}
