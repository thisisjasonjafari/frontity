import { State, Libraries } from "../../../type";
import handler from "../post";

import { mockResponse } from "./mocks/helpers";

const post60 = {
  id: 60,
  date: "2016-11-25T18:31:11",
  slug: "the-beauties-of-gullfoss",
  type: "post",
  link: "https://test.frontity.io/2016/the-beauties-of-gullfoss/",
  author: 4,
  featured_media: 62,
  meta: [],
  categories: [57, 59, 56, 3, 8, 58],
  tags: [10, 9, 13, 11]
};

let state: State["source"];
let libraries: Libraries;

beforeEach(() => {
  // mock state
  state = {
    data: () => ({}),
    dataMap: {},
    category: {},
    tag: {},
    post: {},
    page: {},
    author: {},
    attachment: {},
    apiUrl: "https://test.frontity.io",
    isCom: false
  };
  // mock libraries
  libraries = {
    source: {
      resolver: {
        registered: [],
        init: jest.fn(),
        add: jest.fn(),
        match: jest.fn()
      },
      api: {
        apiUrl: "https://test.frontity.io",
        isCom: false,
        init: jest.fn(),
        getIdBySlug: jest.fn(),
        get: jest.fn().mockResolvedValue(mockResponse([post60]))
      },
      populate: jest.fn().mockResolvedValue([
        {
          id: 60,
          slug: "the-beauties-of-gullfoss",
          link: "https://test.frontity.io/2016/the-beauties-of-gullfoss/"
        }
      ])
    }
  };
});

describe("post", () => {
  test("doesn't exist in source.post", async () => {
    // source.fetch("/the-beauties-of-gullfoss/")
    await handler(state, {
      path: "/the-beauties-of-gullfoss/",
      params: { slug: "the-beauties-of-gullfoss" },
      libraries
    });

    expect(state.dataMap).toMatchSnapshot();
  });

  test("exists in source.post", async () => {
    const get = libraries.source.api.get as jest.Mock;

    state.post[60] = post60;

    // source.fetch("/the-beauties-of-gullfoss/")
    await handler(state, {
      path: "/the-beauties-of-gullfoss/",
      params: { slug: "the-beauties-of-gullfoss" },
      libraries
    });

    expect(get).not.toBeCalled();
    expect(state.dataMap).toMatchSnapshot();
  });

  test("throws an error if it doesn't exist", async () => {
    libraries.source.api.get = jest
      .fn()
      .mockResolvedValueOnce(mockResponse([]));

    libraries.source.populate = jest
      .fn()
      .mockResolvedValueOnce(mockResponse([]));

    // source.fetch("/the-beauties-of-gullfoss/")
    const promise = handler(state, {
      path: "/the-beauties-of-gullfoss/",
      params: { slug: "the-beauties-of-gullfoss" },
      libraries
    });
    
    expect(promise).rejects.toThrowError();
  });
});
