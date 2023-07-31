import { useState } from 'react'
import { ethers } from "ethers"
import { Row, Form, Button } from 'react-bootstrap'
import {app, db, storage} from "../../Firebase/firebase";
import { getStorage, uploadBytes, ref, getDownloadURL } from "firebase/storage";
import { getDatabase, set, ref as dbRef } from "firebase/database";
// import { create as ipfsHttpClient } from 'ipfs-http-client'
// const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')




function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min + 1) ) + min;
}


const Create = ({ marketplace, nft }) => {
  const [image, setImage] = useState('')
  const [price, setPrice] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')


  const uploadToStorage = async (file) => {

    let file_name = getRndInteger(100000000, 1000000000).toString();
    const storageRef = ref(storage, file_name);

    let snapshot = await uploadBytes(storageRef, file);
    let downloadURL =  await getDownloadURL(snapshot.ref);
    console.log('Download URL', downloadURL);
    await setImage(downloadURL);

    return {file_name, downloadURL};

  }


  const createNFT = async () => {


    const fileUploader = document.querySelector('#input-file');
    const getFile = fileUploader.files
    if (getFile.length !== 0) {
      const uploadedFile = getFile[0];
      uploadToStorage(uploadedFile)
      .then(({file_name, downloadURL})=>{

        console.log(image, price, name, description, file_name, downloadURL);

        if (!downloadURL || !price || !name || !description) return
        try{

          set(dbRef(db, 'NFT/' + file_name), {
            name: name,
            desc: description,
            price: price,
            phash:'sdfgdgdfgfd',
            uri:downloadURL
          }).then(()=>{
            mintThenList(file_name);
            console.log('yes');
          });
      //     //Add image with metadata to db
      //     // const result = await client.add(JSON.stringify({image, price, name, description}))
      //     // console.log(result);
      //     // mintThenList();
        } catch(error) {
          console.log("ipfs uri upload error: ", error)
        }

      })
      .catch((err)=>{
        console.log(err);
      });;

    }
  }


  const mintThenList = async (file_name) => {

    const uri = file_name;
    // mint nft 
    await(await nft.mint(uri)).wait()
    // get tokenId of new nft 
    const id = await nft.tokenCount()
    // approve marketplace to spend nft
    await(await nft.setApprovalForAll(marketplace.address, true)).wait()
    // add nft to marketplace
    const listingPrice = ethers.utils.parseEther(price.toString())
    console.log(nft.address, id, listingPrice);
    await(await marketplace.makeItem(nft.address, id, listingPrice)).wait()
    // await(await makeItem(nft.address, id, listingPrice)).wait()
  }

  const handleChange = (event) => {
    const fileUploader = document.querySelector('#input-file');
    const getFile = fileUploader.files
    if (getFile.length !== 0) {
      const uploadedFile = getFile[0];
      readFile(uploadedFile);

    }
  }
  

  const readFile = (uploadedFile) => {
    if (uploadedFile) {
      const reader = new FileReader();
      reader.onload = () => {
        const parent = document.querySelector('.preview-box');
        parent.innerHTML = `<img class="preview-content" src=${reader.result} />`;
      };
      
      reader.readAsDataURL(uploadedFile);
    }
  };



  return (
    <div className="container-fluid mt-5">
      <div className="row">
      <main role="main" className="col-lg-5 mx-auto" style={{ maxWidth: '1000px' }}>

        <div className="container">
            <input
              type="file"
              id="input-file"
              name="input-file"
              accept="image/*"
              onChange={handleChange}
              hidden
            />
            <label className="btn-upload my-5" for="input-file" role="button">
              Upload Photo
            </label>
          </div>
          <Row className="g-4">
            <Form.Control onChange={(e) => setName(e.target.value)} size="lg" className=" my-3 bg-dark text-white"required type="text" placeholder="Name" />
            <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" rows="5" className=" my-3 bg-dark text-white" required as="textarea" placeholder="Description" />
            <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" className=" my-3 bg-dark text-white" required type="number" placeholder="Price in ETH" />
            <div >
              <Button  className="btn btn-primary btn-lg" onClick={createNFT} style={{background: '#7c14fb'}} >
                Create & List NFT!
              </Button>
            </div>
          </Row>
        </main>
        <main role="main" className="col-lg-5 mx-auto my-3" style={{ maxWidth: '1000px' }}>
        <div className="preview-box border border-warning rounded-3"></div> 
        </main>
      </div>
    </div>
  );
}

export default Create




