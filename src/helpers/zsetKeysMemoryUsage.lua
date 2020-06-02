--[[
  Input:
    ARGV[1]  keys prefix
    ARGV[2]  set name
    ARGV[3]  limit

  Output:
    (integer) bytesAmount
]]

local jobs = redis.call("ZREVRANGE", ARGV[1]..ARGV[2], 0, ARGV[3])

local bytesAmount = 0

if (#jobs > 0) then
  for _, jobId in ipairs(jobs) do
    bytesAmount = bytesAmount + redis.call('memory', 'usage', ARGV[1]..jobId)
  end  
end

return {bytesAmount, #jobs}