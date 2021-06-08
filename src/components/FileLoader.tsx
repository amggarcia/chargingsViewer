import React, { useState, useRef } from "react";
import Button from "@material-ui/core/Button";
import { Parser } from "xml2js";
import { Usage } from "../types/Usage";
import SubUsage from "../types/SubUsage";

interface props {
  setData: Function;
  openAverages: Function;
}

function FileLoader(props: props) {
  const [loadedUsages, setData] = useState([] as Usage[]);
  const fileInput = useRef(null);
  function onButtonClick() {
    if (fileInput && fileInput.current) fileInput.current.click();
  }

  function clearFiles() {
    fileInput.current.value = "";
    setData([] as Usage[]);
    props.setData([] as Usage[]);
  }

  function parseFile(file: File): Promise<any> {
    return new Promise((resolve, reject) => {
      var parser = new Parser({ explicitArray: false });
      var reader = new FileReader();

      reader.onload = function (evt: any) {
        parser.parseString(reader.result, function (err: any, result: any) {
          resolve(result);
        });
      };
      reader.onerror = function (evt: any) {
        reject(evt);
      };
      reader.readAsText(file);
    });
  }

  async function loadXMLFile(files: FileList) {
    var tempData: Usage[] = [];

    if (files.length <= 0) return;
    for (var i = 0; i < files.length; i++) {
      await parseFile(files[i]).then((result) => {
        //Very hammer much wow
        tempData = tempData.concat(result.Usages.Usage);
      });
    }

    console.log(tempData);
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
