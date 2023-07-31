import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card } from 'react-bootstrap'
import {app, db} from "../../Firebase/firebase";
import { getDatabase, ref, onValue} from "firebase/database";


function renderSoldItems(items) {
  return (
    <>
      <div className="px-5 py-3 container">
      <i className='text-white far fa-clock fs-3'>Sold NFTs....</i>
      <Row xs={1} md={2} lg={4} className="g-4 py-3">
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
                  <small className="card-meta mb-2 my-0 text-white d-block">Price:</small>
                    <i className="far fa-clock fs-5">Sold for {ethers.utils.formatEther(item.totalPrice)} ETH - Recieved {ethers.utils.formatEther(item.price)} ETH</i>
                  </div>
              </div>
            </div>
          </div>
          </div>
      </div>
        ))}
      </Row>
      </div>
    </>
  )
}

export default function MyListedItems({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true)
  const [listedItems, setListedItems] = useState([])
  const [soldItems, setSoldItems] = useState([])
  const loadListedItems = async () => {
    // Load all sold items that the user listed
    const itemCount = await marketplace.itemCount()
    let listedItems = []
    let soldItems = []
    console.log(itemCount);
    for (let indx = 1; indx <= itemCount; indx++) {
      const i = await marketplace.items(indx)
      console.log(i)
      if (i.seller.toLowerCase() === account) {
      //   // get uri url from nft contract
      const uri = await nft.tokenURI(i.tokenId)
      //   // use uri to fetch the nft metadata stored on ipfs 
      //   const response = await fetch(uri)
      //   const metadata = await response.json()
      //   // get total price of item (item price + fee)

      let starCountRef = ref(db, 'NFT/' + `/${uri}`);

      let data={
        name : " ",
        desc : " ",
        uri : " "
      };
        onValue(starCountRef, (snapshot) => {
          data = snapshot.val();
          console.log(data);
        });

      const totalPrice = await marketplace.getTotalPrice(i.itemId)
      //   // define listed item object
        let item = {
          totalPrice,
          price: i.price,
          itemId: i.itemId,
      //     name: metadata.name,
      //     description: metadata.description,
      //     image: metadata.image
          name: data.name,
          description: data.desc,
          image: data.uri
        }
      //   // Add listed item to sold items array if sold
        if (i.sold) 
          soldItems.push(item)
        else 
          listedItems.push(item)
      }
    }
    setLoading(false)
    setListedItems(listedItems)
    setSoldItems(soldItems)
  }
  useEffect(() => {
    loadListedItems()
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <i className='text-white far fa-clock fs-3'>Loading....</i>
    </main>
  )
  return (
    <div className="flex justify-center">
      {listedItems.length > 0 ?
        <div className="px-5 py-3 container">
            <i className='text-white far fa-clock fs-3'>Your Listed NFTs....</i>
          <Row xs={1} md={2} lg={4} className="g-4 py-3">
            {listedItems.map((item, idx) => (
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
                      <small className="card-meta mb-2 my-0 text-white d-block">Listed Price:</small>
                        <i className="far fa-clock fs-5">{ethers.utils.formatEther(item.totalPrice)} ETH</i>
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
            <i className='text-white far fa-clock fs-3'>You don't any NFTs listed...</i>
          </main>
        )}
        {
          soldItems.length > 0 ? (
                  renderSoldItems(soldItems)

          ) : (
          <main style={{ padding: "1rem 0" }}>
            <i className='text-white far fa-clock fs-3'>You have not sold any NFTs yet...</i>
          </main>
        )
        }
    </div>
  );
}



{/* <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Footer>{ethers.utils.formatEther(item.totalPrice)} ETH</Card.Footer>
                </Card>
              </Col> */}



            //   <Col key={idx} className="overflow-hidden">
            //   <Card>
            //     <Card.Img variant="top" src={item.image} />
            //     <Card.Footer>
            //       For {ethers.utils.formatEther(item.totalPrice)} ETH - Recieved {ethers.utils.formatEther(item.price)} ETH
            //     </Card.Footer>
            //   </Card>
            // </Col>