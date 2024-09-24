/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import { Handle, Position } from "reactflow";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const mapInfo = {
  Diffuse: "Defines the base color of the material.",
  Environment: "Controls environmental settings.",
  Refraction: "Determines how light bends through the material.",
  Bump: "Adds surface detail without changing geometry.",
  Normal: "Creates a normal map, affecting how the surface is lit.",
  Displacement: "Modifies the surface geometry for added detail.",
  Specular: "Determines the shininess and highlight size.",
  Emissive: "Makes the material appear self-illuminated.",
  Opacity: "Controls the transparency of the material.",
  AO: "Adds shading based on occlusion by surrounding objects.",
  Metalness: "Gives the surface a metallic appearance.",
  Roughness: "Determines the smoothness of the surface.",
};

const MainNode = ({ data }) => (
  <div
    style={{
      padding: "20px",
      backgroundColor: "#fff",
      border: "2px solid #ddd",
      borderRadius: "12px",
      width: "280px",
      color: "#333",
      fontFamily: "Barlow, sans-serif",
      position: "relative",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    }}
  >
    <strong
      style={{
        display: "block",
        marginBottom: "15px",
        fontSize: "18px",
        textAlign: "center",
        color: "#333",
      }}
    >
      {data.label}
    </strong>
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {data.maps.map((map, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 0",
            borderBottom:
              index !== data.maps.length - 1 ? "1px solid #e0e0e0" : "none",
            position: "relative",
          }}
        >
          <span
            style={{
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              color: "#333",
            }}
          >
            {map}
            <InfoOutlinedIcon
              style={{
                marginLeft: "8px",
                fontSize: "16px",
                color: "#888",
                cursor: "pointer",
              }}
            />
          </span>

          <Handle
            type="target"
            position={Position.Left}
            id={`handle-${index}`}
            style={{
              background: "#40E0D0",
              width: "10px",
              height: "10px",
              borderRadius: "0%",
              position: "absolute",
              left: "-18px",
              top: "50%",
              transform: "translateY(-50%)",
            }}
          />
        </div>
      ))}
    </div>
  </div>
);

export default MainNode;
//v3 - All UI updated
