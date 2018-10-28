const fs = require('fs');
const request = require('request');
const path = require('path');
const md5 = require('md5');

var recordFile;
var records = [];


const populateRecords = () => {
  if (fs.existsSync(recordFile)) {
    var text = fs.readFileSync(recordFile).toString();
    if (text.trim()) {
      records = text.split("\n")
    }
    else {
      records = [];
    }
    console.log(text);
  }
}

const addRecord = (file) => {
  var md5Str = md5(fs.readFileSync(file));
  fs.appendFile(recordFile, md5Str + "\n", (err) => {
    if (err) throw err;
    console.log('Added: ' + md5Str);
    records.push(md5Str);
  });
}

const doesRecordExist = (md5) => {
  if (records.includes(md5)) {
    return true
  }
  return false
}
/**
 * @function  [streamable]
 * @returns {list} streamable ids
 */
const streamable = (username, password, input) => {

  const videos = gatherVideos(input ? input : ".");

  if (videos.length == 0) {
    return console.log("No videos found.");
  }

  console.log("Uploading " + videos.length + " video(s)...");

  videos.forEach(video => {
    upload2Streamable(username, password, video, console.log);
  });

};


/**
 * @function  [streamableLoopInit]
 * @returns {list} streamable ids
 */
const streamableLoopInit = (username, password, folder, secs) => {

  folder = folder ? folder : ".";
  recordFile = folder + path.sep + "streamableRecordFile.txt";
  populateRecords()
  console.log("Identified Records: " + records);
  var millisecs = 10000;
  if (secs && secs > 10) {
    millisecs = secs * 1000;
  }
  console.log(millisecs);

  streamableLoop(username, password, folder, millisecs)
};

/**
 * @function  [streamableLoop]
 * @returns {list} streamable ids
 */
async function streamableLoop (username, password, folder, millisecs) {

  const videos = gatherVideos(folder);

  if (videos.length == 0) {
    return console.log("No videos found.");
  }
  console.log("Uploading " + videos.length + " video(s)...");
  // await upload2Streamable(username, password, videos[0], addRecord);
  // videos.forEach(video => {
  //   upload2Streamable(username, password, video, addRecord);
  // })
  for (x in videos) {
    console.log(videos[x].path)
    await upload2Streamable(username, password, videos[x], addRecord);
  }
  // await processUploadParallel (videos, username, password).then(console.log("Done2!"));
  console.log("Done3!");

  //setTimeout(streamableLoop(username, password, folder, millisecs), millisecs);

}

async function processUploadParallel(videos, username, password) {
    const promises = videos.map( video => {
      if (!doesRecordExist(video)) {
        upload2Streamable(username, password, video, addRecord);
      }
    });
    return await Promise.all(promises);
}

// async function processUpload(videos, username, password) {
//     for (const video of videos) {
//       if (!doesRecordExist(md5(video))) {
//         await upload2Streamable(username, password, video, addRecord);
//       }
//     }
//     console.log("DONE!");
// }

function upload2Streamable(username, password, video, cb) {
  console.log("Done0!");
  return new Promise(function(resolve, reject) {
    request({
      method: 'POST',
      url: `https://api.streamable.com/upload`,
      formData: { video },
      json: true,
      auth: { username, password }
    }, (err, res, body) => {
      console.log("Done1!");
      if (err) {
        reject(err)
      }
      const { shortcode } = body
      console.log("Uploaded " + video.path + " with shortcode [" + shortcode + "]");
      cb(video.path);
    })
  })
  // return req
}

function gatherVideos(input) {
  var files = [];
  var videos = [];

  var stats = fs.lstatSync(input);
  if (stats.isFile()) {
    console.log("Found file: " + input);
    files.push(input);
  } else if (stats.isDirectory()){
    console.log("Found directory: " + input);
    var temp = fs.readdirSync(input);
    temp.forEach( t => {
      files.push(input + path.sep + t);
    });
  } else {
    return console.log("[Error] You should not be here."); //Handle error
  }

  files.forEach(file => {
    if (file.endsWith(".mp4")) {
      console.log(file);
      videos.push(fs.createReadStream(file));
    }
  });
  return videos;
}

// function moveFile(uploadFolder, )

// Export all methods
module.exports = { streamable, streamableLoopInit};
