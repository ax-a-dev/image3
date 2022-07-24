import { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "../Image.json";
import Navbar from "../components/Navbar";
import { Button, Input, Spacer, Loading } from "@nextui-org/react";
import toast, { Toaster } from "react-hot-toast";
import { useNetwork } from "wagmi";

export default function Upload() {
  const contractABI = abi.abi;
  const [images, setImages] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [name, setName] = useState("");
  const [url, setURL] = useState("");
  const { chain, chains } = useNetwork();

  useEffect(() => {
    (async () => {
      try {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const imageContract = new ethers.Contract(
            chain.network === "goerli"
              ? "0xEa3c45d10A20dE4eBf9fC82eCFBFFDcb69C61F78"
              : chain.network === "rinkeby"
              ? "0x05D38bA308E90fBE67eda6723a9D9062aC412EcC"
              : null,
            contractABI,
            signer
          );

          let count = await imageContract.getTotalImages();
          setImages(count.toNumber());
        } else {
          toast.error("Please connect your wallet!");
        }
      } catch (e) {
        toast.error(e.toString());
      }
    })();
  }, []);

  function isUrl(string) {
    let url;

    try {
      url = new URL(string);
    } catch (_) {
      return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
  }

  function isImage(url) {
    return /^https?:\/\/.+\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
  }

  async function upload() {
    if (!name || !url) {
      toast.error("Name or URL missing!");
      return;
    }

    if (!isUrl("http://" + url)) {
      toast.error("Invalid URL!");
      return;
    }

    if (!isImage("http://" + url)) {
      toast.error("Not an Image URL!");
      return;
    }

    if (isUrl("http://" + url) && isImage("http://" + url) && name) {
      try {
        const { ethereum } = window;
        if (ethereum) {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const imageContract = new ethers.Contract(
            chain.network === "goerli"
              ? "0xEa3c45d10A20dE4eBf9fC82eCFBFFDcb69C61F78"
              : chain.network === "rinkeby"
              ? "0x05D38bA308E90fBE67eda6723a9D9062aC412EcC"
              : null,
            contractABI,
            signer
          );

          setUploading(true);
          const imageTxn = await imageContract.uploadImage(name, url);
          await imageTxn.wait();

          let count = await imageContract.getTotalImages();
          setImages(count.toNumber());
          setUploading(false);
          toast.success("Uploaded Image successfully!");
        } else {
          toast.error("Ethereum object not found! Please connect your wallet!");
        }
      } catch (e) {
        toast.error(e.toString());
        setUploading(false);
      }
    }
  }

  return (
    <div className="bg-gray-800 min-h-screen flex items-center justify-center">
      <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            background: "#344047",
            color: "#6a97c7",
          },
        }}
      />
      <div className="absolute top-0 right-0 left-0">
        <Navbar />
      </div>
      <div>
        <Input
          color="primary"
          labelPlaceholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Spacer y={1.5} />
        <Input
          label="Image URL"
          color="primary"
          labelLeft="https://"
          placeholder="example.com/test.jpg"
          value={url}
          onChange={(e) =>
            setURL(
              e.target.value.replace("https://", "").replace("http://", "")
            )
          }
        />
        <Spacer y={1.5} />
        {uploading ? (
          <Button disabled auto bordered color="primary" css={{ px: "$13" }}>
            <Loading color="currentColor" size="sm" />
          </Button>
        ) : (
          <Button auto color="primary" shadow ghost loading onPress={upload}>
            Upload Image
          </Button>
        )}
      </div>
    </div>
  );
}
