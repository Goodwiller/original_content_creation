import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card } from 'react-bootstrap'
import {app, db} from "../../Firebase/firebase";
import { getDatabase, ref, onValue} from "firebase/database";





export default function MyPurchases({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true)
  const [purchases, setPurchases] = useState([])
  const loadPurchasedItems = async () => {
    // Fetch purchased items from marketplace by quering Offered events with the buyer set as the user
    const filter =  marketplace.filters.Bought(null,null,null,null,null,account)
    const results = await marketplace.queryFilter(filter)
    //Fetch metadata of each nft and add that to listedItem object.
    const purchases = await Promise.all(results.map(async i => {
      // fetch arguments from each result
      i = i.args
      // get uri url from nft contract
      const uri = await nft.tokenURI(i.tokenId)
      // use uri to fetch the nft metadata stored on ipfs 
      // const response = await fetch(uri)
      // const metadata = await response.json()
      // get total price of item (item price + fee)

      let starCountRef = ref(db, 'NFT/' + `/${uri}`);

      let data={
        name : " ",
        desc : " ",
        uri : " "
      };;
      onValue(starCountRef, (snapshot) => {
        data = snapshot.val();
        console.log(data);
      });



      const totalPrice = await marketplace.getTotalPrice(i.itemId)
      // define listed item object
      let purchasedItem = {
        totalPrice,
        price: i.price,
        itemId: i.itemId,
        name: data.name,
        description: data.desc,
        image: data.uri
      }
      return purchasedItem
    }))
    setLoading(false)
    setPurchases(purchases)
  }
  useEffect(() => {
    loadPurchasedItems()
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <i className='text-white far fa-clock fs-3'>Loading.....</i>
    </main>
  )
  return (
    <div className="flex justify-center">
      {purchases.length > 0 ?
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-4 py-5">
            {purchases.map((item, idx) => (
          <div className="col-sm-12 col-md-6 col-lg-4 mb-4" key={idx}><div className="card text-white card-has-bg click-col" style={{ backgroundImage: `url(${item.image})` }}>
          <img className="card-img d-none" alt="Goverment Lorem Ipsum Sit Amet Consectetur dipisi?"></img>
          <div className="card-img-overlay d-flex flex-column">
            <div className="card-body">
              <small className="card-meta mb-2"></small>
                <h4 className="card-title mt-0 "><a className="text-white" herf="#">{item.name}</a></h4>
                <small><i className="far fa-clock fs-5">{item.description}</i></small>
            </div>
            <div className="card-footer">
              <div className="media">
                  <div className="media-body">
                    <i className="far fa-clock fs-5">Bought for : {ethers.utils.formatEther(item.totalPrice)} ETH</i>
                  </div>
              </div>
            </div>
          </div>
          </div>
      </div>
            ))}
          </Row>
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <i className='text-white far fa-clock fs-3'>No purchases....</i>
          </main>
        )}
    </div>
  );
}
