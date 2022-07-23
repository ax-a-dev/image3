import Navbar from "../components/Navbar";
import abi from "../Image.json";
import { useState, useEffect } from "react";
import { Button, Spacer, Image } from "@nextui-org/react";
import { useRouter } from "next/router";
import { ethers } from "ethers";
import toast, { Toaster } from "react-hot-toast";
import Card from "../components/Card";

const Home = () => {
  const contractAddress = "0xEa3c45d10A20dE4eBf9fC82eCFBFFDcb69C61F78";
  const contractABI = abi.abi;
  const [images, setImages] = useState(0);
  const [names, setNames] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [urls, setUrls] = useState([]);
  const [likes, setLikes] = useState([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const { ethereum } = window;
  
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const contract = new ethers.Contract(
            contractAddress,
            contractABI,
            signer
          );
  
          let count = await contract.getTotalImages();
          setImages(count.toNumber())
  
          let [names, addresses, urls, likes] = await contract.getImages();
          setNames(names);
          setAddresses(addresses);
          setUrls(urls);
          setLikes(likes);
        } else {
          toast.error("Please connect your wallet!");
        }
      } catch (e) {
        toast.error(e.toString());
      }
    })();
  }, []);

  function upload() {
    router.push("/upload");
  }

  async function like(id) {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );
        
        const txn = await contract.likeImage(id);
        await txn.wait();
        toast.success("Successfully liked image!")
      } else {
        toast.error("Please connect your wallet!");
      }
    } catch (e) {
      toast.error(e.toString());
    }
  }

  return (
    <div className="bg-gray-800 min-h-screen">
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#344047",
            color: "#6a97c7",
          },
        }}
      />
      <Navbar />
      {images === 0 ? (
        <div className="flex flex-col items-center">
          <div className="relative p-8 text-center rounded-lg m-10 w-1/4 bg-slate-700">
            <h2 className="text-2xl font-medium">There&apos;s nothing here...</h2>

            <p className="mt-4 text-sm text-gray-500">
              Uploaded images will appear here, try uploading one!
            </p>
            <Spacer y={1.5} />
            <div className="flex flex-col items-center">
              <Button
                auto
                color="primary"
                shadow
                ghost
                loading
                onPress={upload}
              >
                Upload Image
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-4 p-8">
          {names.map((img, ind) => (
            <button key={ind} onClick={() => like(ind)}>
              <Card address={addresses[ind]} name={img} url={"http://"+urls[ind]} likes={likes[ind].toNumber()} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
