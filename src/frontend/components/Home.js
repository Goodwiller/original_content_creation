import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card, Button } from 'react-bootstrap'
import {app, db} from "../../Firebase/firebase";
import { getDatabase, ref, onValue} from "firebase/database";


const Home = ({ marketplace, nft }) => {
  const [loading, setLoading] = useState(true)
  const [items, setItems] = useState([])

  const loadMarketplaceItems = async () => {
    // Load all unsold items
    const itemCount = await marketplace.itemCount()
    console.log(itemCount);
    let items = []
    for (let i = 1; i <= itemCount; i++) {
      // console.log("Yes");
      const item = await marketplace.items(i)
      // console.log(item);
      if (!item.sold) {
      //   // get uri url from nft contract
        let uri = await nft.tokenURI(item.tokenId)
        console.log(uri)
        let starCountRef = ref(db, 'NFT/' + `/${uri}`);


        const totalPrice = await marketplace.getTotalPrice(item.itemId)

        let data={
          name : " ",
          desc : " ",
          uri : " "
        };


        onValue(starCountRef, (snapshot) => {
          data = snapshot.val();
          console.log(data);
          
        });


        items.push({
          totalPrice,
          itemId: item.itemId,
          seller: item.seller,
          name: data.name,
          description: data.desc,
          image: data.uri
        })
      }
      
    }
    
    setItems(items);
    setLoading(false);
  }

  const buyMarketItem = async (item) => {
    await (await marketplace.purchaseItem(item.itemId, { value: item.totalPrice })).wait()
    // loadMarketplaceItems()
    loadMarketplaceItems();
  }

  useEffect(async () => {
    loadMarketplaceItems();
  }, [])


  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
       <i className='text-white far fa-clock fs-3'>Loading.....</i>
    </main>
  )
  
  return (
    <div className="flex justify-center">
      {items.length > 0 ?
        <div className="px-5 container">
          <Row xs={1} md={2} lg={4} className="g-5 py-5">
            {items.map((item, idx) => (
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
                            <small className="card-meta mb-2 my-0 text-white d-block">Sold By:&nbsp; {item.seller}</small>
                              <h6 className="my-0 text-white d-block"></h6>
                              <Button className="bg-dark bg-gradient"onClick={() => buyMarketItem(item)} variant="primary" size="md">
                        Buy for {ethers.utils.formatEther(item.totalPrice)} ETH
                      </Button>
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
            <i className='text-white far fa-clock fs-3'>No listed Assets.....</i>
          </main>
        )}
    </div>
  );

}
export default Home

