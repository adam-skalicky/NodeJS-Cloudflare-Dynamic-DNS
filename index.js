const CronJob = require('cron').CronJob;
const fetch = require('node-fetch')

const zoneID = "foundOnOverView";
const dnsName = "name.of.domain.com"
const cftoken = "See https://support.cloudflare.com/hc/en-us/articles/200167836-Managing-API-Tokens-and-Keys"
const timeZone = "America/Los_Angeles"
const cronTime = "* * * * *"


const cf = require('cloudflare')({
    token: cftoken
  });

const getCurrentIP = async () => {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const json = await response.json();
    return json.ip;
  } catch (error) {
    console.log(error);
  }
};

const getCurrentRecordResult = async () =>{
        const zoneInfo = await cf.dnsRecords.browse(zoneID);
        const zoneRecords = zoneInfo.result
        let recordID;
        zoneRecords.forEach(record => {
            if (record.name === dnsName) {
                recordID = record.id;
            }
        });
        let recordInfo;
        if (typeof(recordID !== null)) {
            const recordResult = await cf.dnsRecords.read(zoneID, recordID)
            recordInfo = recordResult.result
        }
        return recordInfo
}

const updateRecordIP = async (newRecord) => {
    const recordID = newRecord.id
    const updateResponse = await cf.dnsRecords.edit(zoneID, recordID, newRecord);
}


(async() => {
    const job = new CronJob({
        cronTime,
        onTick: async function() {
            console.log(Date())
            const currentIP = await getCurrentIP();
            const currentRecord = await getCurrentRecordResult();
            const dnsCurrentIP = currentRecord.content
            console.log({currentIP,dnsCurrentIP})
            if (currentIP !== dnsCurrentIP) {
                console.log('Updating IP from ' + dnsCurrentIP + " to " + currentIP)
                let newRecord = currentRecord
                newRecord.content=currentIP
                await updateRecordIP(newRecord)
            } else {
                console.log('IP is current.')
            }
        },
        start: false,
        timeZone
      });
      job.start();
  })();