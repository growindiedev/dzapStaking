'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

import { useAccount, useReadContract, useWriteContract } from 'wagmi';
import { contractAddress } from '@/abi/config';
import { abi } from '@/abi/abi';
import { useForm } from 'react-hook-form';

//function getStakerInfo(address staker_) view returns (bool exist, uint256 stakedAmount, uint256 unclaimedRewards, uint256 claimCheckpoint, uint256 totalRewardsClaimed)
// function getDetails() view returns (bool isPaused, bool resetClaimDelay, address stakeToken, address rewardToken, uint256 startBlock, uint256 endBlock, uint256 claimDelay, uint256 totalRewards, uint256 totalFundsStaked, uint256 totalRewardsDistributed)
// 	function stake(uint256 amount_)
//  function unstake()
//  function claimRewards()
// "event Staked(address indexed staker, uint256 stakedAmount)",
// 	"event Unstaked(address indexed staker, uint256 stakedAmount)",
// 	"event RewardClaimed(address indexed staker, uint256 amount)",

const Main = () => {
  const { register, handleSubmit, getValues, watch } = useForm({
    defaultValues: {
      tokenAmount: 0,
    },
  });

  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const getDetails = useReadContract({
    abi,
    address: contractAddress,
    functionName: 'getDetails',
  });

  const getStakerInfo = useReadContract({
    abi,
    address: contractAddress,
    functionName: 'getStakerInfo',
    args: [address as '0xString'],
  });

  console.log('getDetails', getDetails.data);
  console.log('getStakerInfo', getStakerInfo.data);

  return (
    <div className="flex  items-center justify-center h-full">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>DZAP MT3 Staking</CardTitle>
          <CardDescription>
            Stake your MT3 tokens and earn rewards.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5 gap-2">
                <Label htmlFor="amount">MT3 tokens amount</Label>
                <Input
                  type="number"
                  id="tokenAmount"
                  {...register('tokenAmount')}
                  placeholder="amount of tokens you want to stake"
                />
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">Current claimable tokens</Badge>
                <Badge>
                  {getStakerInfo.data
                    ? Number(getStakerInfo.data[2])
                    : 'not available'}
                </Badge>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline">Staked Amount</Badge>
                <Badge variant="secondary">
                  {getStakerInfo.data
                    ? Number(getStakerInfo.data[1])
                    : 'not available'}
                </Badge>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button
            className="w-full"
            onClick={handleSubmit(async (data) => {
              console.log('data', data);
              await writeContractAsync({
                address: contractAddress,
                abi: abi,
                functionName: 'claimRewards',
              });
            })}
          >
            Claim rewards
          </Button>
          <div className="flex w-full gap-3">
            <Button
              onClick={handleSubmit(async (data) => {
                console.log('data', data);
                await writeContractAsync({
                  address: contractAddress,
                  abi: abi,
                  functionName: 'stake',
                  args: [BigInt(data.tokenAmount)],
                });
              })}
              variant="secondary"
              className="w-1/2"
            >
              Stake
            </Button>
            <Button
              variant="secondary"
              className="w-1/2"
              onClick={handleSubmit(async (data) => {
                console.log('data', data);
                await writeContractAsync({
                  address: contractAddress,
                  abi: abi,
                  functionName: 'unstake',
                });
              })}
            >
              Unstake
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Main;
