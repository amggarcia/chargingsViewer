import { useState, useRef } from "react";
import Button from "@mui/material/Button";
import { Parser } from "xml2js";
import { Usage } from "../types/Usage";
import SubUsage from "../types/SubUsage";

interface props {
  setData: Function;
  openAverages: Function;
}

function FileLoader(props: props) {
  const [_, setData] = useState([] as Usage[]);
  const fileInput = useRef<HTMLInputElement>(null);
  function onButtonClick() {
    if (fileInput && fileInput.current) fileInput.current.click();
  }

  function clearFiles() {
    if (fileInput && fileInput.current) {
      fileInput.current.value = "";
    }

    setData([] as Usage[]);
    props.setData([] as Usage[]);
  }

  function parseFile(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      var parser = new Parser({ explicitArray: false });
      var reader = new FileReader();

      reader.onload = function () {
        parser.parseString(reader.result as string, function (result: any) {
          resolve(result);
        });
      };
      reader.onerror = function (evt: any) {
        reject(evt);
      };
      reader.readAsText(file);
    });
  }

  async function loadXMLFile(files: FileList | null) {
    var tempData: Usage[] = [];
    if (files == null) {
      return;
    }

    if (files.length <= 0) return;
    for (var i = 0; i < files.length; i++) {
      await parseFile(files[i]).then((result) => {
        //Very hammer much wow
        tempData = tempData.concat(result.Usages.Usage);
      });
    }

    tempData = tempData.map((item) => {
      return Object.assign(new Usage(), item);
    });
    tempData.forEach((item) => {
      if (Array.isArray(item.SubUsage)) item.SubUsage = item.SubUsage;
      else if (item.SubUsage) item.SubUsage = [item.SubUsage];
      else item.SubUsage = [];

      item.SubUsage = item.SubUsage.map((x) => {
        return Object.assign(new SubUsage(), x);
      });
    });
    setData(tempData);
    props.setData(tempData);
  }

  return (
    <div>
      <Button
        variant="contained"
        color="primary"
        onClick={onButtonClick}
        style={{ margin: "10px" }}
      >
        Load Files
      </Button>
      <input
        type="file"
        id="file"
        accept=".xml"
        onChange={(e) => loadXMLFile(e.target.files)}
        ref={fileInput}
        multiple
        style={{ display: "none" }}
      />
      <Button
        variant="contained"
        color="secondary"
        onClick={clearFiles}
        style={{ margin: "10px" }}
      >
        Clear Files
      </Button>
      <Button
        variant="contained"
        style={{ margin: "10px" }}
        onClick={() => props.openAverages(true)}
      >
        Get averages
      </Button>
    </div>
  );
}

export default FileLoader;
