import e,{useRef as t,useState as i,useEffect as n}from"react";const o=Object.create({});function s(e){return!!o[e]&&o[e][window.location.href]||null}function r(e,t){if(s(t))return s(t)||100;let i=e;if(i.getBoundingClientRect().width<32)for(i=i.parentNode;"BODY"!==i.tagName&&i.getBoundingClientRect().width<=32;)i=i.parentNode;return Math.ceil(i.getBoundingClientRect().width/window.innerWidth*100)}const a="undefined"!=typeof HTMLImageElement&&"loading"in HTMLImageElement.prototype,l=window.IntersectionObserver;const c=e=>Object.entries(e).map(([e,t])=>`${t} ${e}w`).join(", ");function d(d){const u=t(null),m=t(null),g=d.aspectRatio?`${100/d.aspectRatio}%`:d.height,p="eager"===d.loading||d.critical,h=!!s(d.src),[w,f]=i({sizes:h?s(d.src):d.sizes,isVisible:h||p||a||!l,shouldFadeIn:!h||d.fadeIn,imgLoaded:h||!1}),b=e=>f(t=>({...t,...e}));function v(){var e,t;h||(e=d.src,t=Number(w.sizes),o[e]={...o[e]||{},[window.location.href]:t},b({imgLoaded:!0}))}n(()=>{h||b({sizes:d.sizes||r(m.current,d.src)});const e=!w.isVisible&&function(e,t){const i=new window.IntersectionObserver(([n])=>{(n.isIntersecting||n.intersectionRatio>0)&&(i.unobserve(e),t())},{rootMargin:"200px"});return i.observe(e),i}(m.current,()=>b({isVisible:!0}));if(p){const e=u.current;e&&e.complete&&v()}return()=>{e&&e.unobserve(m.current)}},[]);const y=!w.shouldFadeIn||w.imgLoaded,I={position:"absolute",top:0,left:0,width:"100%",height:"100%",objectFit:d.fit,objectPosition:d.position},z={opacity:y?1:0,transition:w.shouldFadeIn?`opacity ${d.durationFadeIn}ms`:"none",...d.imgStyle},S={transition:d.transparent&&w.shouldFadeIn?`opacity ${d.durationFadeIn}ms`:void 0,transitionDelay:d.transparent?"0":`${d.durationFadeIn}ms`},C={opacity:w.imgLoaded?0:1,...w.shouldFadeIn&&S,...d.imgStyle,...d.placeholderStyle};return e.createElement("div",{style:{position:"relative",overflow:"hidden"},className:d.className},e.createElement("div",{style:{width:"100%",paddingBottom:g},ref:m}),d.bgColor&&e.createElement("div",{className:d.placeholderClass,style:{backgroundColor:d.bgColor,...I,...C}}),!d.bgColor&&d.placeholder&&e.createElement("img",{src:d.placeholder,alt:d.alt,className:d.placeholderClass,style:{...I,...C}}),w.isVisible&&e.createElement("picture",null,d.webpSrcSet&&e.createElement("source",{type:"image/webp",srcSet:c(d.webpSrcSet),sizes:w.sizes?`${w.sizes}vw`:void 0}),d.srcSet&&e.createElement("source",{srcSet:c(d.srcSet),sizes:w.sizes?`${w.sizes}vw`:void 0}),e.createElement("img",{ref:u,src:d.src,className:d.imgClass,alt:d.alt,sizes:`${w.sizes}vw`,loading:p?"eager":d.loading,onLoad:v,style:{...I,...z}})))}d.defaultProps={loading:"lazy",fadeIn:!0,fit:"cover",position:"center",height:"100%",durationFadeIn:500,alt:""};export{d as Image};
//# sourceMappingURL=index.es.js.map