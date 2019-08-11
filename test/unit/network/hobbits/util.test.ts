import PeerInfo from "peer-info";
import waterfall from "async/waterfall";
import promisify from "es6-promisify";
import {peerInfoToAddress} from "../../../../src/network/hobbits/util";
import _ from "lodash";
import {intToBytes} from "../../../../src/util/bytes";

describe("[hobbits] network", () => {
  it('should get port and url from PeerInfo - callback', function () {
    let addr;
    waterfall([
      (cb) => PeerInfo.create(cb),
      (peerInfo, cb) => {
        peerInfo.multiaddrs.add('/ip4/0.0.0.0/tcp/0');
        addr = peerInfo.multiaddrs.toArray()[0];
        console.log(addr.nodeAddress());
      }
    ], (err) => {
      if (err) { throw err; }
    });

  });

  it('should get port and url from PeerInfo - promisify', async function () {
    this.timeout(5000);
    let peerInfo = await promisify(PeerInfo.create.bind(this))();
    peerInfo.multiaddrs.add('/ip4/0.0.0.0/tcp/0');
    let addr = peerInfo.multiaddrs.toArray()[0];
    console.log(peerInfo.id._idB58String);
    console.log(addr.protoNames()[1]);
    console.log(addr.nodeAddress());
  });

  it('should get address correctly', async function () {
    let peerInfo = await promisify(PeerInfo.create.bind(this))();
    peerInfo.multiaddrs.add('/ip4/0.0.0.0/udp/0');

    let nodeAddress = peerInfoToAddress(peerInfo);
    console.log(nodeAddress);
  });

  it('should convert camelCase to underscored', function () {
    let obj = {
      method_id: intToBytes(12, 2, "be"),
      body: null
    };
    const obj2 = _.mapKeys(obj, (v, k) => _.camelCase(k));

    console.log(obj);
    console.log(obj2);

    const obj3 = _.mapKeys(obj2, (v, k) => _.snakeCase(k));
    console.log(obj3);
  });
});