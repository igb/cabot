-module(cabot).
-export([loop/0]).

loop()->
    io:format("running...", []),
    Result = os:cmd("../node/bin/node ../cabot.js"),
    io:format("~p~n", [Result]),
% OS X local development paths    
%    Result = os:cmd("node cabot.js"),
    [Tweet, AltText001, AltText025, AltText050, AltText100] = string:tokens(Result, "\n"),
    io:format("~s~n", [AltText001]),
    erlybird:tweet(Tweet, [{"img001.png", AltText001}, {"img025.png", AltText025},{"img050.png", AltText050},{"img100.png", AltText100}]),
    timer:sleep(1000 * 60 * 60 * 6), % EVERY 6 HOURS
    loop().


-ifdef(TEST).
-include_lib("eunit/include/eunit.hrl").
-endif.


