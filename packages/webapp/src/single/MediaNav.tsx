import * as React from "react";
import { useEffect } from "react";

import { useSearchStore } from "../store/search-store";

import { getHigherPreviewUrl, getLowerPreviewUrl } from '../utils/preview'
import { usePreviewSize } from "./usePreviewSize";

export const MediaNav = ({current, prev, next, listLocation, showNavigation, dispatch}) => {
  const query = useSearchStore(state => state.query);
  const previewSize = usePreviewSize()

  const loadImage = async (url: string | false) => {
    return new Promise((resolve) => {
      if (!url) {
        return resolve(true)
      }
      const img = new Image();
      img.addEventListener('load', resolve);
      img.addEventListener('error', resolve);
      img.src = url;
    });
  }

  useEffect(() => {
    let abort = false;

    const preloadPrevNext = async () => {
      if (!abort) {
        await Promise.all([loadImage(getLowerPreviewUrl(next?.previews, previewSize / 4)), loadImage(getLowerPreviewUrl(prev?.previews, previewSize / 4))])
      }
      if (!abort) {
        await Promise.all([loadImage(getHigherPreviewUrl(next?.previews, previewSize)), loadImage(getHigherPreviewUrl(prev?.previews, previewSize))])
      }
    }

    const timerId = setTimeout(preloadPrevNext, 100);

    return () => {
      clearTimeout(timerId)
      abort = true;
    }
  }, [prev, next]);

  const buttonClass = `mediaNav__button ${showNavigation ? '' : '-transparent'}`

  const hasGeo = current?.latitude && current?.longitude && current.latitude != 0 && current.longitude != 0

  return (
    <>
      { prev &&
        <div className="mediaNav -left">
          <a onClick={() => dispatch({type: 'prev'})} className={buttonClass} title="Show previous media (left arrow)">
            <i className="fas fa-chevron-left fa-2x"></i>
          </a>
        </div>
      }
      { next &&
        <div className="mediaNav -right">
          <a onClick={() => dispatch({type: 'next'})} className={buttonClass} title="Show next media (right arrow)">
            <i className="fas fa-chevron-right fa-2x"></i>
          </a>
        </div>
      }
      <div className="mediaNav -bottom">
        { listLocation &&
          <a onClick={() => dispatch({type: 'list'})} className={buttonClass} title="Show media stream (ESC)">
            <i className="fas fa-th fa-2x"></i>
          </a>
        }
        { hasGeo &&
          <a onClick={() => dispatch({type: 'map'})} className={buttonClass} title="Show map of entry (m)">
            <i className="fas fa-map fa-2x"></i>
          </a>
        }
        { current?.similarityHash &&
          <a onClick={() => dispatch({type: 'similar'})} className={buttonClass} title="Show similar images (s)">
            <i className="fas fa-seedling fa-2x"></i>
          </a>
        }
        { query.type != 'none' &&
          <a onClick={() => dispatch({type: 'chronology'})} className={buttonClass} title="Show chronology (c)">
            <i className="fas fa-clock fa-2x"></i>
          </a>
        }
        { current &&
          <a onClick={() => dispatch({type: 'toggleDetails'})} className={buttonClass} title="Show detail info (i)">
            <i className="fas fa-info fa-2x"></i>
          </a>
        }
      </div>
    </>
  )
}

